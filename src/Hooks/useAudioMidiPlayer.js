import { useState, useEffect, useRef } from "react";

// const audioSamples = [
// 	new Audio("cc kick.wav"),
// 	new Audio("[SAINT6] Bounce Clap.wav"),
// ];

// going to need to do synchronized playback with buffers and shit
//use the song playback position as the guide for the midi notes

const songNoDrumsSample = new Audio("end of the road boys no drums.wav");

export default function useAudioMidiPlayer(
	sampleFiles,
	midiDataSorted,
	bpm,
	TOTAL_BEATS,
	setPlayheadPosition,
	loop = true
) {
	const [audioSamples, setAudioSamples] = useState(
		sampleFiles.map((sample) => new Audio(sample))
	);

	useEffect(() => {
		// Initialize audio samples when sampleFiles changes
		setAudioSamples(sampleFiles.map((sample) => new Audio(sample)));
	}, [sampleFiles]);

	const [isPlaying, setIsPlaying] = useState(false);
	const [playedFirstBeat, setPlayedFirstBeat] = useState(false);
	const timeoutsRef = useRef([]);

	const [startTime, setStartTime] = useState(0);
	const [pauseTime, setPauseTime] = useState(0);

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
				setPlayheadPosition(fraction);

				const nextBeats = getNextBeatsAfter(currentBeat);
				if (nextBeats) {
					if (nextBeats[0].startBeat !== nextScheduledBeatTime) {
						const nextBeatTime = ((nextBeats[0].startBeat * 60) / bpm) * 1000;
						const currentTime = Date.now() - startTime;
						const timeUntilNextBeat = nextBeatTime - currentTime;

						if (timeUntilNextBeat <= 60) {
							scheduleBeats(nextBeats, timeUntilNextBeat);
						}
					}
				}
			};

			const intervalId = setInterval(updatePlayheadPosition, 30); // Update every 100 milliseconds

			return () => {
				clearInterval(intervalId); // Cleanup interval on component unmount
			};
		}
	}, [getCurrentBeat, isPlaying]);

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
		setPlayedFirstBeat(false);
		setIsPlaying(true);
		songNoDrumsSample.currentTime = 0;
		songNoDrumsSample.volume = 0.5;
		songNoDrumsSample.play();
		setStartTime(Date.now());
	}

	function pause() {
		songNoDrumsSample.pause();
		setIsPlaying(false);
		setPauseTime(Date.now());
		setPlayedFirstBeat(false);
		clearAllTimeouts();
	}

	function playMidiNote(note) {
		const sample = audioSamples[note % audioSamples.length];
		sample.currentTime = 0;
		sample.play();
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
		const elapsedTime = // songNoDrumsSample.currentTime
			((isPlaying ? Date.now() : pauseTime) - startTime) / 1000; // elapsed time in seconds
		return (elapsedTime / 60) * bpm;
	}

	return {
		togglePlay,
	};
}
