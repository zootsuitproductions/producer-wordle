import { useState, useEffect, useRef } from "react";

export default function useAudioMidiPlayer({
	sampleFiles,
	midiDataSorted,
	bpm,
	TOTAL_BEATS,
	loop = true,
	noteSoundOn = true,
}) {
	const [prevMidiData, setPrevMidiData] = useState([]);

	const [audioContext] = useState(
		() => new (window.AudioContext || window.webkitAudioContext)()
	);

	const [startTime, setStartTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const [audioBuffers, setAudioBuffers] = useState([]);

	const noteSources = useRef({});

	const [noDrumsBuffer, setNoDrumsBuffer] = useState(null);
	const noDrumsSource = useRef(null);

	useEffect(() => {
		const newMidiData = midiDataSorted.filter((event) => {
			return !prevMidiData.some((prevEvent) => prevEvent.id === event.id);
		});

		const removedMidiData = prevMidiData.filter(
			(event) =>
				!midiDataSorted.some((currentEvent) => currentEvent.id === event.id)
		);

		newMidiData.forEach((event) => {
			if (isPlaying) {
				scheduleMidiNoteEvent(startTime, event);
			} else if (noteSoundOn) {
				scheduleMidiNoteEvent(0, event);
			}
		});

		removedMidiData.forEach((event) => {
			try {
				noteSources.current[event.id].stop();
			} catch (error) {
				console.warn("Source already stopped:", error);
			}
			delete noteSources.current[event.id];
		});

		// Update the previous midiDataSorted reference with a deep copy
		setPrevMidiData(midiDataSorted);
	}, [
		midiDataSorted,
		isPlaying,
		prevMidiData,
		startTime,
		setPrevMidiData,
		noteSources,
	]);

	useEffect(() => {
		async function fetchAudioBuffers() {
			const buffers = await Promise.all(
				sampleFiles.map(async (sample) => {
					const response = await fetch(sample);
					const arrayBuffer = await response.arrayBuffer();
					return await audioContext.decodeAudioData(arrayBuffer);
				})
			);
			setAudioBuffers(buffers);
			// Fetch and decode the no-drums sample
			const response = await fetch("end of the road boys no drums.wav");
			const arrayBuffer = await response.arrayBuffer();
			const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
			setNoDrumsBuffer(decodedBuffer);
		}
		fetchAudioBuffers();
	}, [audioContext, setAudioBuffers, sampleFiles]);

	function playNoDrums(currentTime) {
		try {
			noDrumsSource.current.stop();
		} catch {}

		noDrumsSource.current = audioContext.createBufferSource();
		noDrumsSource.current.buffer = noDrumsBuffer;
		noDrumsSource.current.connect(audioContext.destination);
		noDrumsSource.current.start(currentTime);
	}

	function scheduleMidiNoteEvent(currentTime, event) {
		const { startBeat, note, id } = event;
		const beatStartSeconds = (startBeat * 60) / bpm;

		if (beatStartSeconds >= 0) {
			const source = audioContext.createBufferSource();
			source.buffer = audioBuffers[note];
			source.connect(audioContext.destination);
			source.start(currentTime + beatStartSeconds);

			noteSources.current[id] = source;
		}
	}

	const scheduleMIDIPlayback = () => {
		const currentTime = audioContext.currentTime;
		stopAllScheduledNotes(); // I don't know why i need this but i do.
		playNoDrums(currentTime);
		midiDataSorted.forEach((event) => {
			scheduleMidiNoteEvent(currentTime, event);
		});
	};

	const stopAllScheduledNotes = () => {
		console.log(noteSources.current);
		Object.values(noteSources.current).forEach((source) => {
			try {
				source.stop();
				console.log("stopped");
			} catch (error) {
				console.warn("Source already stopped:", error);
			}
		});
		noteSources.current = {}; // Clear the ref
	};

	function togglePlay() {
		setIsPlaying((prevIsPlaying) => {
			if (prevIsPlaying) {
				console.log("pause");
				pause();
			} else {
				console.log("play");
				play();
			}
			return !prevIsPlaying;
		});
	}

	//todo: playing from non-start
	function play() {
		setStartTime(audioContext.currentTime);
		scheduleMIDIPlayback();
	}

	function pause() {
		stopAllScheduledNotes();
		noDrumsSource.current.stop();
	}

	function getCurrentBeat() {
		const elapsedTime = audioContext.currentTime - startTime;
		return (elapsedTime / 60) * bpm;
	}

	return {
		togglePlay,
		isPlaying,
		getCurrentBeat,
	};
}
