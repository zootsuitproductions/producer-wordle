import React, { useState, useEffect } from "react";
import "../CSS/PlaybackModeToggle.css"; // Include styles for animation

function PlaybackModeToggle({ isDisplayingCorrect, setIsDisplayingCorrect }) {
	const [isFirstClick, setIsFirstClick] = useState(true);

	const handleModeChange = (mode) => {
		setIsDisplayingCorrect(mode === "listen");
		if (isFirstClick) {
			setIsFirstClick(false);
		}
	};

	useEffect(() => {
		if (!isFirstClick) {
			const correctButton = document.querySelector(".correct-beat-button");
			if (correctButton) {
				correctButton.classList.remove("pulse-animation");
			}
		}
	}, [isFirstClick]);

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
					className={`toggle-button correct-beat-button ${
						isDisplayingCorrect ? "active" : ""
					} ${isFirstClick ? "pulse-animation" : ""}`}
					onClick={() => handleModeChange("listen")}
				>
					Correct Beat
				</button>
			</div>
		</>
	);
}

export default PlaybackModeToggle;
