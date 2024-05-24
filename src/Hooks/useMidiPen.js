//user on mouse move in the midi timeline. calculate x position.
import { useState } from "react";

export default function useMidiPen({
	getBeatIndexOfMouse,
	removeNote,
	addNoteAndClearSpaceAsNecessary,
	timeDivision,
	TOTAL_BEATS,
}) {
	const [penDragging, setPenDragging] = useState(false);
	const [erasing, setErasing] = useState(false);
	const [currentlyHoveredIndex, setCurrentlyHoveredIndex] = useState(null);
	const [keyRowClicked, setKeyRowClicked] = useState(0);

	function penInNote(keyNumber, index) {
		const startOfBeat = (TOTAL_BEATS * index) / timeDivision;

		console.log(startOfBeat);
		const endOfBeat = TOTAL_BEATS * ((index + 1) / timeDivision);
		addNoteAndClearSpaceAsNecessary(keyNumber, startOfBeat, endOfBeat);
	}

	function penRemoveBeat(keyRowClicked, midiNote) {
		removeNote(keyRowClicked, midiNote.startBeat);
		setKeyRowClicked(keyRowClicked);
		setErasing(true);
	}

	function penAddBeat(keyRowClicked, index) {
		penInNote(keyRowClicked, index);
		setKeyRowClicked(keyRowClicked);
		setCurrentlyHoveredIndex(index);
		setPenDragging(true);
	}

	function getBeatIndexOfMouse(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const beatWidth = rect.width / timeDivision;
		return Math.floor(x / beatWidth);
	}

	function handlePenDrag(event) {
		if (penDragging) {
			const index = getBeatIndexOfMouse(event);
			if (index !== currentlyHoveredIndex) {
				setCurrentlyHoveredIndex(index);
				penInNote(keyRowClicked, index);
			}
		} else if (erasing) {
			const index = getBeatIndexOfMouse(event);
			if (index !== currentlyHoveredIndex) {
				setCurrentlyHoveredIndex(index);

				const startOfBeat = (TOTAL_BEATS * index) / timeDivision;
				removeNote(keyRowClicked, startOfBeat);
			}
		}
	}

	function handlePenUp() {
		setPenDragging(false);
		setErasing(false);
	}

	return {
		penRemoveBeat,
		penAddBeat,
		handlePenDrag,
		handlePenUp,
	};
}
