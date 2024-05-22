import { useState, useEffect, useRef } from "react";

// going to need to do synchronized playback with buffers and shit
//use the song playback position as the guide for the midi notes

const songNoDrumsSample = new Audio("end of the road boys no drums.wav");

export default function useAudioMidiPlayer(
	sampleFiles,
	midiDataSorted,
	bpm,
	TOTAL_BEATS,
	loop = true
) {
	const prevMidiDataRef = useRef([]);

	useEffect(() => {
		const prevMidiData = prevMidiDataRef.current;

		const newMidiData = midiDataSorted.filter(
			(event) => !prevMidiData.some((prevEvent) => prevEvent.id === event.id)
		);
		const removedMidiData = prevMidiData.filter(
			(event) =>
				!midiDataSorted.some((currentEvent) => currentEvent.id === event.id)
		);

		newMidiData.forEach((event) => {
			scheduleMidiNoteEvent(startTime, event);
		});

		removedMidiData.forEach((event) => {
			try {
				noteSources.current[event.id].stop();
			} catch (error) {
				console.warn("Source already stopped:", error);
			}
			delete noteSources.current[event.id];
		});

		// Update the previous midiDataSorted reference
		prevMidiDataRef.current = midiDataSorted;
	}, [midiDataSorted]);

	const [audioSamples, setAudioSamples] = useState(
		sampleFiles.map((sample) => new Audio(sample))
	);

	useEffect(() => {
		// Initialize audio samples when sampleFiles changes
		setAudioSamples(sampleFiles.map((sample) => new Audio(sample)));
	}, [sampleFiles]);

	const [audioContext] = useState(
		() => new (window.AudioContext || window.webkitAudioContext)()
	);

	const [startTime, setStartTime] = useState(0);

	const [audioBuffers, setAudioBuffers] = useState([]);

	const noteSources = useRef({});

	const [noDrumsBuffer, setNoDrumsBuffer] = useState(null);
	const noDrumsSource = useRef(null);

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
	}, [audioContext, sampleFiles]);

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

		const source = audioContext.createBufferSource();
		source.buffer = audioBuffers[note];
		source.connect(audioContext.destination);
		source.start(currentTime + beatStartSeconds);

		noteSources.current[id] = source;
	}

	//todo:: when a new note is added or removed need to

	const scheduleMIDIPlayback = () => {
		const currentTime = audioContext.currentTime;
		stopAllScheduledNotes(); // I don't know why i need this but i do.
		playNoDrums(currentTime);
		midiDataSorted.forEach((event) => {
			scheduleMidiNoteEvent(currentTime, event);
		});
	};

	const stopAllScheduledNotes = () => {
		Object.values(noteSources.current).forEach((source) => {
			try {
				source.stop();
			} catch (error) {
				console.warn("Source already stopped:", error);
			}
		});
		noteSources.current = {}; // Clear the ref
	};

	// const [isPlaying, setIsPlaying] = useState(false);

	// const [playheadPosition, setPlayheadPosition] = useState(0);

	const [isPlaying, setIsPlaying] = useState(false);
	const [playedFirstBeat, setPlayedFirstBeat] = useState(false);
	const timeoutsRef = useRef([]);

	//todo:
	// There is a bug with scheduling,
	// where if u delete a note while playing it will still play.need to unschedule that,
	// and perhaps dont schedule notes for so far in advance.only do it once we are within
	// the playhead update interval of the next beat, then schedule for a few ms in advance for precision

	//to keep track of beats that have been scheduled, not schedule them twice.

	let nextScheduledBeatTime = useRef(0);

	function scheduleBeats(nextMidiEvents, msDelay) {
		nextScheduledBeatTime = nextMidiEvents[0].startBeat;

		const timeoutId = setTimeout(() => {
			nextMidiEvents.map((midiEvent) => playMidiNote(midiEvent.note));
		}, msDelay);
		timeoutsRef.current.push(timeoutId);
	}

	useEffect(() => {
		if (isPlaying) {
			if (!playedFirstBeat) {
				playFirstNoteTimeZero();
			}
			//get next beat times but dont schedule yet
			const updatePlayheadPosition = () => {
				const currentBeat = getCurrentBeat();
				const fraction = currentBeat / TOTAL_BEATS;
				if (fraction >= 1) {
					if (loop) {
						play();
						return;
					} else {
						pause();
						return;
					}
				}
				// setPlayheadPosition(fraction);
				const nextBeats = getNextBeatsAfter(currentBeat);
				if (nextBeats) {
					if (nextBeats[0].startBeat !== nextScheduledBeatTime) {
						const nextBeatTime = ((nextBeats[0].startBeat * 60) / bpm) * 1000;
						const currentTime = songNoDrumsSample.currentTime * 1000;

						// Date.now() - startTime;
						const timeUntilNextBeat = nextBeatTime - currentTime;
						if (timeUntilNextBeat <= 90) {
							// this is fried rn
							scheduleBeats(nextBeats, 0);
						}
					}
				}
			};

			const intervalId = setInterval(updatePlayheadPosition, 30); // Update every 100 milliseconds

			return () => {
				clearInterval(intervalId); // Cleanup interval on component unmount
			};
		}
	}, [TOTAL_BEATS, getCurrentBeat, isPlaying]);

	function getNextBeatsAfter(currentBeat) {
		let left = 0;
		let right = midiDataSorted.length - 1;
		let result = -1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);

			if (midiDataSorted[mid].startBeat > currentBeat) {
				result = mid;
				right = mid - 1; // Search in the left half
			} else {
				left = mid + 1; // Search in the right half
			}
		}

		if (result === -1) {
			return null;
		}

		const nextBeatStart = midiDataSorted[result].startBeat;
		const nextBeats = [midiDataSorted[result]];

		// Collect all events that occur at the same startBeat
		for (let i = result + 1; i < midiDataSorted.length; i++) {
			if (midiDataSorted[i].startBeat === nextBeatStart) {
				nextBeats.push(midiDataSorted[i]);
			} else {
				break;
			}
		}

		return nextBeats;
	}

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

	//todo: playing for non-start
	function play() {
		setStartTime(audioContext.currentTime);
		scheduleMIDIPlayback();
		// setPlayedFirstBeat(false);
		// setIsPlaying(true);
		// songNoDrumsSample.currentTime = 0;
		// songNoDrumsSample.volume = 0.6;
		// songNoDrumsSample.play();
	}

	const resetAudioContext = () => {
		stopAllScheduledNotes();
		// const newAudioContext = new (window.AudioContext ||
		// 	window.webkitAudioContext)();
		// setAudioContext(newAudioContext);
	};

	function pause() {
		console.log("pausing");
		stopAllScheduledNotes();
		noDrumsSource.current.stop();
		// audioContext.suspend();
		// stopNoDrums();
		// songNoDrumsSample.pause();
		// setIsPlaying(false);
		// setPlayedFirstBeat(false);
		// clearAllTimeouts();
	}

	function playMidiNote(note) {
		const sample = audioSamples[note % audioSamples.length];
		sample.currentTime = 0;
		// sample.play();
		// playSample(note);
	}

	function playFirstNoteTimeZero() {
		const downBeats = getNextBeatsAfter(-1);
		if (downBeats && downBeats.length > 0 && downBeats[0].startBeat === 0) {
			downBeats.map((downBeat) => playMidiNote(downBeat.note));
		}
		setPlayedFirstBeat(true);
	}

	function clearAllTimeouts() {
		timeoutsRef.current.forEach(clearTimeout);
		timeoutsRef.current = [];
	}

	function getCurrentBeat() {
		const elapsedTime = audioContext.currentTime - startTime;
		// songNoDrumsSample.currentTime;
		// ((isPlaying ? Date.now() : pauseTime) - startTime) / 1000; // elapsed time in seconds
		return (elapsedTime / 60) * bpm;
	}

	return {
		togglePlay,
		isPlaying,
		getCurrentBeat,
	};
}
