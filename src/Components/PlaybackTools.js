import React, { useEffect, useState } from "react";
import "../App.css";
import PlaybackModeToggle from "./PlaybackModeToggle";
import { useMidiContext } from "../Providers/MidiProvider";

function PlaybackTools({
	bpm,
	setBpm,
	isDisplayingCorrect,
	setIsDisplayingCorrect,
}) {
	const { midi, audioMidiPlayer, midiEditorKeyControls } = useMidiContext();
	const [numMoves, setNumMoves] = useState(0);
	const [numIncorrectNotes, setNumIncorrectNotes] = useState(0);

	useEffect(() => {
		if (audioMidiPlayer.correctAudioTimesPlayed === 0) return;
		setNumMoves((prev) => prev + 1);
	}, [audioMidiPlayer.correctAudioTimesPlayed]);

	useEffect(() => {
		setNumMoves((prev) => prev + numIncorrectNotes);
	}, [numIncorrectNotes]);

	// Handler to increase the tempo
	const increaseBpm = (e) => {
		e.target.blur(); // Remove focus from the button
		setBpm((prevBpm) => prevBpm + 5);
	};

	// Handler to decrease the tempo
	const decreaseBpm = (e) => {
		e.target.blur(); // Remove focus from the button
		setNumMoves((prev) => prev + 5);
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
		audioMidiPlayer.togglePlay(0);
		// audioMidiPlayer.playFromBeat(4);
	};

	// Handler to toggle pen mode
	const togglePenMode = (e) => {
		e.target.blur(); // Remove focus from the button
		midiEditorKeyControls.togglePenMode((prev) => !prev);
	};

	// Handler to check for correctness
	const checkForCorrectness = (e) => {
		e.target.blur(); // Remove focus from the button
		const incorrectNotes = midi.checkForCorrectness();
		midi.checkForCorrectness();

		//todo: make the notes turn green if they got it right
		if (incorrectNotes === 0 && midi.getNumberOfNotesUserIsMissing() === 0) {
			window.alert("You got it right in " + numMoves + " moves!");
		} else {
			window.alert(
				"You got " +
					incorrectNotes +
					" notes wrong, and are missing " +
					midi.getNumberOfNotesUserIsMissing() +
					" notes."
			);
		}
		setNumIncorrectNotes(incorrectNotes);
	};

	// Handler to halve time division
	const halveTimeDivision = (e) => {
		e.target.blur(); // Remove focus from the button
		midiEditorKeyControls.halveTimeDivision();
	};

	// Handler to double time division
	const doubleTimeDivision = (e) => {
		e.target.blur(); // Remove focus from the button
		midiEditorKeyControls.doubleTimeDivision();
	};

	// Handler to toggle triplet mode
	const toggleTripletMode = (e) => {
		e.target.blur(); // Remove focus from the button
		midiEditorKeyControls.toggleTripletMode();
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
				<button onClick={togglePlayback} className="playback-button">
					{audioMidiPlayer.isPlaying ? "Pause (space)" : "Play (space)"}
				</button>
				<button onClick={togglePenMode} className="playback-button">
					{midiEditorKeyControls.penModeActivated
						? "Disable Pen Mode (b)"
						: "Enable Pen Mode (b)"}
				</button>

				<div></div>
				<div className="toggle-label">Grid: </div>
				<button onClick={halveTimeDivision} className="playback-button">
					Halve (Cmd 1)
				</button>
				<button onClick={doubleTimeDivision} className="playback-button">
					Double (Cmd 2)
				</button>
				<button onClick={toggleTripletMode} className="playback-button">
					{midiEditorKeyControls.tripletModeActivated
						? "Disable Triplets (Cmd 3)"
						: "Enable Triplets (Cmd 3)"}
				</button>
				<button onClick={checkForCorrectness} className="check-button">
					Check Correctness
				</button>
			</div>

			<div className="moves-counter">Moves: {numMoves}</div>
		</div>
	);
}

export default PlaybackTools;
