import { useState, useEffect, useRef } from "react";

export default function useAudioMidiPlayer({
	sampleFiles,
	midiDataSorted,
	correctData,
	bpm,
	noDrumsWav,
	noDrumsBpm,
	isDisplayingCorrect,
	TOTAL_BEATS,
	loop = true,
	noteSoundOn = true,
}) {
	useEffect(() => {
		// Update playback position when BPM changes
		if (isPlaying && noDrumsBuffer && noDrumsSource.current) {
			console.log("is displaying" + isDisplayingCorrect);
			togglePlay();
			// Calculate the elapsed time in beats
			const elapsedBeats =
				(audioContext.currentTime - timeWhenPlaybackStarted) / (60 / bpm);

			// Calculate the playback position in seconds based on the new BPM
			const newPlaybackPositionSeconds = (elapsedBeats * 60) / noDrumsBpm;

			// Stop and restart the noDrumsSource at the new position
			// try {
			// 	noDrumsSource.current.stop();
			// } catch {}

			// noDrumsSource.current = audioContext.createBufferSource();
			// noDrumsSource.current.buffer = noDrumsBuffer;
			// noDrumsSource.current.connect(audioContext.destination);
			// noDrumsSource.current.start(0, newPlaybackPositionSeconds);

			try {
				noDrumsSource.current.stop();
			} catch {}

			// noDrumsSource.current = audioContext.createBufferSource();
			// noDrumsSource.current.buffer = noDrumsBuffer;
			// noDrumsSource.current.connect(audioContext.destination);

			// // Adjust the playback rate based on the current BPM
			// const playbackRate = bpm / noDrumsBpm;

			// console.log(playbackRate);
			// noDrumsSource.current.playbackRate.value = playbackRate;

			// noDrumsSource.current.start(0);
		}
	}, [bpm, isDisplayingCorrect]); // Trigger this effect whenever bpm changes

	const [prevMidiData, setPrevMidiData] = useState([]);

	const [audioContext] = useState(
		() => new (window.AudioContext || window.webkitAudioContext)()
	);

	const [timeWhenPlaybackStarted, setTimeWhenPlaybackStarted] = useState(0);
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
				console.log("schedule and playing");
				scheduleMidiNoteEvent(timeWhenPlaybackStarted, event);
			} else if (noteSoundOn) {
				console.log("schedule and sound on");
				playMidiNoteInstantly(event);
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
		timeWhenPlaybackStarted,
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
			// const response = await fetch("end of the road boys no drums.wav");
			console.log(noDrumsWav);
			const response = await fetch(noDrumsWav);
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

		// Adjust the playback rate based on the current BPM
		const playbackRate = bpm / noDrumsBpm;

		console.log(playbackRate);
		noDrumsSource.current.playbackRate.value = playbackRate;

		noDrumsSource.current.start(currentTime);
	}

	function scheduleMidiNoteEvent(startTime, event) {
		const { startBeat, note, id } = event;
		const beatStartSeconds = (startBeat * 60) / bpm;

		if (beatStartSeconds >= 0) {
			const source = audioContext.createBufferSource();
			source.buffer = audioBuffers[note];
			source.connect(audioContext.destination);
			const playbackRate = bpm / noDrumsBpm;

			source.playbackRate.value = playbackRate;
			source.start(startTime + beatStartSeconds);

			noteSources.current[id] = source;
		}
	}

	function playMidiNoteInstantly(event) {
		const { startBeat, note, id } = event;
		const beatStartSeconds = (startBeat * 60) / bpm;

		if (beatStartSeconds >= 0) {
			const source = audioContext.createBufferSource();
			source.buffer = audioBuffers[note];
			source.connect(audioContext.destination);
			const playbackRate = bpm / noDrumsBpm;

			source.playbackRate.value = playbackRate;
			source.start();

			noteSources.current[id] = source;
		}
	}

	const scheduleMIDIPlayback = (data) => {
		const currentTime = audioContext.currentTime;
		stopAllScheduledNotes(); // I don't know why i need this but i do.
		playNoDrums(currentTime);
		data.forEach((event) => {
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
		setTimeWhenPlaybackStarted(audioContext.currentTime);

		console.log("user ");
		console.log(midiDataSorted);
		console.log("correct ");
		console.log(correctData);
		console.log(isDisplayingCorrect);
		// scheduleMIDIPlayback(correctData);
		if (isDisplayingCorrect) {
			console.log("correct");
			scheduleMIDIPlayback(correctData);
		} else {
			console.log("user");
			scheduleMIDIPlayback(midiDataSorted);
		}
		// scheduleMIDIPlayback(midiDataSorted);
	}

	function pause() {
		stopAllScheduledNotes();
		noDrumsSource.current.stop();
	}

	function getCurrentBeat() {
		const elapsedTime = audioContext.currentTime - timeWhenPlaybackStarted;
		return (elapsedTime / 60) * bpm;
	}

	return {
		togglePlay,
		isPlaying,
		getCurrentBeat,
	};
}
