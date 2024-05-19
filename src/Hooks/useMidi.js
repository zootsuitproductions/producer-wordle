import { useState, useEffect, useRef } from "react";
import useMidi from "./useMidi";

const audioSamples = [
	new Audio("cc kick.wav"),
	new Audio("[SAINT6] Bounce Clap.wav"),
];

export default function useAudioMidiPlayer(
	data,
	bpm,
	TOTAL_BEATS,
	setPlayheadPosition
) {
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

	useEffect(() => {
		console.log("MIDI DATA " + data + " !");
		if (isPlaying) {
			if (!playedFirstBeat) {
				playFirstNoteTimeZero();
			}
			scheduleNextBeat();
		}
	}, [data, isPlaying]);

	useEffect(() => {
		if (isPlaying) {
			//get next beat times but dont schedule yet
			const updatePlayheadPosition = () => {
				const currentBeat = getCurrentBeat();
				const fraction = currentBeat / TOTAL_BEATS;
				setPlayheadPosition(fraction);

				const nextBeats = getNextBeatsAfter(currentBeat);
				if (nextBeats) {
					const nextBeatTime = ((nextBeats[0].startBeat * 60) / bpm) * 1000;
					const currentTime = Date.now() - startTime;
					const timeUntilNextBeat = nextBeatTime - currentTime;

					if (timeUntilNextBeat <= 30) {
						nextBeats.forEach((midiEvent) => playMidiNote(midiEvent.note));
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
		let right = data.length - 1;
		let result = -1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);

			if (data[mid].startBeat > currentBeat) {
				result = mid;
				right = mid - 1; // Search in the left half
			} else {
				left = mid + 1; // Search in the right half
			}
		}

		if (result === -1) {
			return null;
		}

		const nextBeatStart = data[result].startBeat;
		const nextBeats = [data[result]];

		// Collect all events that occur at the same startBeat
		for (let i = result + 1; i < data.length; i++) {
			if (data[i].startBeat === nextBeatStart) {
				nextBeats.push(data[i]);
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

	function play() {
		setIsPlaying(true);
		setStartTime(Date.now());
	}

	function pause() {
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

	function scheduleNextBeat() {
		//ADD HANDLING OF CONCURRENT NOTES
		const nextMidiEvents = getNextBeatsAfter(getCurrentBeat());

		if (!nextMidiEvents) {
			//schedule the end, stop playing
			return;
		}

		const startBeat = nextMidiEvents[0].startBeat;
		const beatInterval = 60 / bpm;

		const nextBeatTime = startBeat * beatInterval * 1000; // in milliseconds
		const currentTime = Date.now();
		const delay = nextBeatTime - (currentTime - startTime);

		const timeoutId = setTimeout(() => {
			nextMidiEvents.map((midiEvent) => playMidiNote(midiEvent.note));
			if (isPlaying) {
				scheduleNextBeat();
			}
		}, delay);
		timeoutsRef.current.push(timeoutId);
	}

	function clearAllTimeouts() {
		timeoutsRef.current.forEach(clearTimeout);
		timeoutsRef.current = [];
	}

	function getCurrentBeat() {
		const elapsedTime =
			((isPlaying ? Date.now() : pauseTime) - startTime) / 1000; // elapsed time in seconds
		return (elapsedTime / 60) * bpm;
	}

	return {
		// getCurrentBeat,
		togglePlay,
	};
}
