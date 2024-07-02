import { useState, useEffect } from "react";

export default function useMidiEditorKeyControls({
	togglePlay,
	checkForCorrectness,
	saveToLocalStorage,
	removeSelectedBeats,
	commitSelectionMovement,
	TOTAL_BEATS,
}) {
	const [timeDivision, setTimeDivision] = useState(32);
	const [penModeActivated, setPenModeActivated] = useState(false);
	const [tripledModeActivated, setTripletModeActivated] = useState(false);

	//useMidiClipboard

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.ctrlKey || event.metaKey) {
				switch (event.key) {
					case "d":
						event.preventDefault(); // Prevent default behavior if necessary
						break;
					case "c":
						event.preventDefault(); // Prevent default behavior if necessary
						break;
					default:
						break;
				}
			} else {
				switch (event.key) {
					case "s":
						saveToLocalStorage();
						break;
					case "c":
						checkForCorrectness();
						break;
					case "3":
						if (tripledModeActivated) {
							setTimeDivision((timeDivision / 3) * 2);
							setTripletModeActivated(false);
						} else {
							setTimeDivision((timeDivision / 2) * 3);
							setTripletModeActivated(true);
						}
						break;
					case "2":
						setTimeDivision(timeDivision * 2);
						break;
					case "1":
						setTimeDivision(timeDivision / 2);
						break;
					case "b":
						const body = document.querySelector("body");
						if (!penModeActivated) {
							body.style.cursor = "crosshair";
						} else {
							body.style.cursor = "auto";
						}
						setPenModeActivated(!penModeActivated);
						break;
					case " ":
						togglePlay();
						break;
					case "Backspace":
						removeSelectedBeats();
						break;
					case "ArrowRight":
						commitSelectionMovement(TOTAL_BEATS / timeDivision);
						break;
					case "ArrowLeft":
						commitSelectionMovement(-(TOTAL_BEATS / timeDivision));
						break;
					default:
						break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [
		timeDivision,
		penModeActivated,
		tripledModeActivated,
		togglePlay,
		saveToLocalStorage,
		removeSelectedBeats,
		checkForCorrectness,
	]);

	return {
		timeDivision,
		penModeActivated,
	};
}
