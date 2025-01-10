import React from "react";
import "../App.css";
import PlaybackModeToggle from "./PlaybackModeToggle";

function PlaybackTools({
	bpm,
	setBpm,
	isDisplayingCorrect,
	setIsDisplayingCorrect,
}) {
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
		</div>
	);
}

export default PlaybackTools;
