import React, { useState } from "react";
import "../CSS/PlaybackModeToggle.css"; // Include styles for animation

function PlaybackModeToggle({ isDisplayingCorrect, setIsDisplayingCorrect }) {
	const handleModeChange = (mode) => {
		setIsDisplayingCorrect(mode === "listen");
	};

	return (
		<>
			<div className="toggle-label">Playback: </div>
			<div className="toggle-container">
				<div
					className="toggle-border"
					style={{
						transform: isDisplayingCorrect
							? "translateX(100%)"
							: "translateX(0)",
					}}
				></div>
				<button
					className={`toggle-button ${!isDisplayingCorrect ? "active" : ""}`}
					onClick={() => handleModeChange("edit")}
				>
					Your Pattern
				</button>
				<button
					className={`toggle-button ${isDisplayingCorrect ? "active" : ""}`}
					onClick={() => handleModeChange("listen")}
				>
					Correct Beat
				</button>
			</div>
		</>
	);
}

export default PlaybackModeToggle;
