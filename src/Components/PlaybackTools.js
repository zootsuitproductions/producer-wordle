import React from "react";
import "../App.css";
import PlaybackModeToggle from "./PlaybackModeToggle";
import { useMidiContext } from "../Providers/MidiProvider";

function PlaybackTools({
	bpm,
	setBpm,
	isDisplayingCorrect,
	setIsDisplayingCorrect,
}) {
	const { audioMidiPlayer, midiEditorKeyControls } = useMidiContext();

	// Handler to increase the tempo
	const increaseBpm = (e) => {
		e.target.blur(); // Remove focus from the button
		setBpm((prevBpm) => prevBpm + 5);
	};

	// Handler to decrease the tempo
	const decreaseBpm = (e) => {
		e.target.blur(); // Remove focus from the button
		setBpm((prevBpm) => (prevBpm > 1 ? prevBpm - 5 : prevBpm)); // Prevent BPM from dropping below 1
	};

	// Handler to toggle between correct data and user data
	const toggleCorrectMode = (e) => {
		e.target.blur(); // Remove focus from the button
		setIsDisplayingCorrect((prev) => !prev);
	};

	// Handler to toggle playback
	const togglePlayback = (e) => {
		e.target.blur(); // Remove focus from the button
		audioMidiPlayer.togglePlay();
	};

	// Handler to toggle pen mode
	const togglePenMode = (e) => {
		e.target.blur(); // Remove focus from the button
		midiEditorKeyControls.togglePenMode((prev) => !prev);
	};

	return (
		<div className="playback-tools">
			<div className="bpm-controls">
				<button onClick={decreaseBpm} className="playback-button">
					-
				</button>
				<span className="playback-bpm">{bpm} BPM</span>
				<button onClick={increaseBpm} className="playback-button">
					+
				</button>

				<PlaybackModeToggle
					isDisplayingCorrect={isDisplayingCorrect}
					setIsDisplayingCorrect={setIsDisplayingCorrect}
				/>
			</div>
			<button onClick={togglePlayback} className="playback-button">
				{audioMidiPlayer.isPlaying ? "Pause" : "Play"}
			</button>
			<button onClick={togglePenMode} className="playback-button">
				{midiEditorKeyControls.penModeActivated
					? "Disable Pen Mode"
					: "Enable Pen Mode"}
			</button>
		</div>
	);
}

export default PlaybackTools;
