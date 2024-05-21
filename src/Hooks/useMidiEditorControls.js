import { useState, useEffect } from "react";
import MidiNoteEvent from "../Models/MidiNoteEvent";

export default function useMidiEditorControls(
	togglePlay,
	checkForCorrectness,
	saveToLocalStorage
) {
	const [timeDivision, setTimeDivision] = useState(32);
	const [penModeActivated, setPenModeActivated] = useState(false);
	const [tripledModeActivated, setTripletModeActivated] = useState(false);

	useEffect(() => {
		const handleKeyPress = (event) => {
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
				default:
					break;
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
	]);

	return {
		timeDivision,
		penModeActivated,
	};
}
