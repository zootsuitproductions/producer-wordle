import { useState, useEffect, useRef } from "react";
import useMidi from "./useMidi";

const audioSamples = [
	new Audio("cc kick.wav"),
	new Audio("[SAINT6] Bounce Clap.wav"),
];

export default function useAudioMidiPlayer(data, bpm) {
	const { midiData, getNextBeatsAfter } = useMidi(data);

	const [isPlaying, setIsPlaying] = useState(false);
	const [playedFirstBeat, setPlayedFirstBeat] = useState(false);
	const timeoutsRef = useRef([]);

	const [startTime, setStartTime] = useState(0);
	const [pauseTime, setPauseTime] = useState(0);

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

	useEffect(() => {
		console.log("MIDI DATA " + midiData + " !");
		if (isPlaying) {
			if (!playedFirstBeat) {
				playFirstNoteTimeZero();
			}
			scheduleNextBeat();
		}
	}, [midiData, isPlaying]);

	function getCurrentBeat() {
		const elapsedTime =
			((isPlaying ? Date.now() : pauseTime) - startTime) / 1000; // elapsed time in seconds
		return (elapsedTime / 60) * bpm;
	}

	return {
		getCurrentBeat,
		togglePlay,
	};
}
