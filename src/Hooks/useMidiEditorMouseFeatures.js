//user on mouse move in the midi timeline. calculate x position.
import { useState } from "react";
import useMidiPen from "./useMidiPen";

export default function useMidiEditorMouseFeatures({
	penModeActivated,
	removeNote,
	addNoteAndClearSpaceAsNecessary,
	timeDivision,
	TOTAL_BEATS,
}) {
	const { penRemoveBeat, penAddBeat, handlePenDrag, handlePenUp } = useMidiPen({
		getBeatIndexOfMouse,
		removeNote,
		addNoteAndClearSpaceAsNecessary,
		timeDivision,
		TOTAL_BEATS,
	});

	function handleBeatClick(event, keyRowClicked, midiNote) {
		if (penModeActivated) {
			penRemoveBeat(keyRowClicked, midiNote);
		} else {
			// selectBeat()
			// setSelectedBeats((prevSelection) => {
			// 	const newSelection = [...prevSelection];
			// 	newSelection.push(midiNote);
			// 	console.log(newSelection);
			// 	return newSelection;
			// });
		}
	}

	function handleMouseDown(event, keyRowClicked, index) {
		if (penModeActivated) {
			penAddBeat(keyRowClicked, index);
		} else {
			//drag
		}
	}

	function getBeatIndexOfMouse(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const beatWidth = rect.width / timeDivision;
		return Math.floor(x / beatWidth);
	}

	function handleMouseMove(event) {
		if (penModeActivated) {
			handlePenDrag(event);
		}
	}

	function handleMouseUp() {
		if (penModeActivated) {
			handlePenUp();
		}
	}

	return {
		handleBeatClick,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	};
}
