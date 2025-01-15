import { useState, useEffect } from "react";

export default function useMidiEditorKeyControls({
	togglePlay,
	checkForCorrectness,
	saveToLocalStorage,
	removeSelectedBeats,
	commitSelectionMovement,
	TOTAL_BEATS,
	saveToJSONFile,
}) {
	const [timeDivision, setTimeDivision] = useState(32);
	const [penModeActivated, setPenModeActivated] = useState(true);
	const [tripletModeActivated, setTripletModeActivated] = useState(false);

	useEffect(() => {
		if (penModeActivated) {
			const body = document.querySelector("body");
			body.style.cursor = "crosshair";
		}
	}, []);

	function togglePenMode() {
		const body = document.querySelector("body");
		if (!penModeActivated) {
			body.style.cursor = "crosshair";
		} else {
			body.style.cursor = "auto";
		}
		setPenModeActivated(!penModeActivated);
	}

	function halveTimeDivision() {
		setTimeDivision((prev) => prev / 2);
	}

	function doubleTimeDivision() {
		setTimeDivision((prev) => prev * 2);
	}

	function toggleTripletMode() {
		if (tripletModeActivated) {
			setTimeDivision((prev) => (prev / 3) * 2);
		} else {
			setTimeDivision((prev) => (prev / 2) * 3);
		}
		setTripletModeActivated((prev) => !prev);
	}

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
					case "2":
						event.preventDefault();
						doubleTimeDivision();
						break;
					case "1":
						event.preventDefault();
						halveTimeDivision();
						break;
					case "3":
						event.preventDefault();
						toggleTripletMode();
						break;

					default:
						break;
				}
			} else {
				switch (event.key) {
					case "s":
						// saveToLocalStorage();
						saveToJSONFile();
						break;
					case "c":
						// console.log("INCORRECT: ");
						// console.log(checkForCorrectness());

						// checkForCorrectness();
						break;

					case "b":
						togglePenMode();
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
		tripletModeActivated,
		togglePlay,
		saveToLocalStorage,
		removeSelectedBeats,
		checkForCorrectness,
	]);

	return {
		timeDivision,
		penModeActivated,
		togglePenMode,
		halveTimeDivision,
		doubleTimeDivision,
		toggleTripletMode,
		tripletModeActivated,
	};
}
