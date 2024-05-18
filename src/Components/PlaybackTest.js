import { useState, useEffect } from "react";
import "../App.css";
import Playhead from "./Playhead";
import useAudioMidiPlayer from "../Hooks/useAudioPlayer";

export default function PlaybackTimelineTest() {
	const [timelineWidth, setTimelineWidth] = useState(500);
	const [midiData, setMidiData] = useState([
		{ noteNumber: 0, noteStart: 0.25, noteEnd: 0.5, velocity: 0.8 },
		{ noteStart: 1 / 3, noteEnd: 2 / 3, velocity: 0.9 },
	]);

	const [samplesArray, setSamplesArray] = useState(["cc kick.wav"]);
	const [bpm, setBpm] = useState(120);

	const TOTAL_BEATS = 24;
	const { getCurrentBeat, togglePlay } = useAudioMidiPlayer([
		{ note: 0, startBeat: 0, endBeat: 0.5, velocity: 0.9 },
		{ note: 0, startBeat: 1, endBeat: 1, velocity: 0.8 },
		{ note: 0, startBeat: 2, endBeat: 2, velocity: 0.85 },
		{ note: 0, startBeat: 3, endBeat: 2, velocity: 0.85 },

		{ note: 0, startBeat: 4, endBeat: 2, velocity: 0.85 },

		{ note: 0, startBeat: 5, endBeat: 2, velocity: 0.85 },
	]);

	const [playheadPosition, setPlayheadPosition] = useState(0);

	const style = {
		width: timelineWidth + "px",
	};

	useEffect(() => {
		const updatePlayheadPosition = () => {
			const currentBeat = getCurrentBeat();
			const fraction = currentBeat / TOTAL_BEATS;
			setPlayheadPosition(fraction);
		};

		const intervalId = setInterval(updatePlayheadPosition, 100); // Update every 100 milliseconds

		return () => {
			clearInterval(intervalId); // Cleanup interval on component unmount
		};
	}, [getCurrentBeat]);

	useEffect(() => {
		// pause / play listener
		const handleKeyPress = (event) => {
			if (event.key === " ") {
				togglePlay();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<div style={style} className="timeline--container">
			<Playhead
				timelineWidth={timelineWidth}
				positionFraction={playheadPosition}
			/>
		</div>
	);
}
