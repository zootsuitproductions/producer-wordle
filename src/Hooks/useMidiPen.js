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

	const [penDragStartIndex, setPenDragStartIndex] = useState(null);
	const [keyRowClicked, setKeyRowClicked] = useState(0);
	// const containerRef = useRef(null);

	function penInNote(keyNumber, index) {
		const startOfBeat = (TOTAL_BEATS * index) / timeDivision;

		console.log(startOfBeat);
		const endOfBeat = TOTAL_BEATS * ((index + 1) / timeDivision);
		addNoteAndClearSpaceAsNecessary(keyNumber, startOfBeat, endOfBeat);
	}

	function penRemoveBeat(keyRowClicked, midiNote) {
		removeNote(keyRowClicked, midiNote.startBeat);
		let index = (midiNote.startBeat * timeDivision) / TOTAL_BEATS;
		setPenDragStartIndex(index);
		setCurrentlyHoveredIndex(index);
		setKeyRowClicked(keyRowClicked);
		setErasing(true);
	}

	function penAddBeat(keyRowClicked, index) {
		penInNote(keyRowClicked, index);
		setKeyRowClicked(keyRowClicked);
		setCurrentlyHoveredIndex(index);
		setPenDragging(true);
		setPenDragStartIndex(index);
		console.log("pen add beat");
	}

	function handlePenDrag(event) {
		if (penDragging) {
			const index = getBeatIndexOfMouse(event);
			if (index !== penDragStartIndex && index !== currentlyHoveredIndex) {
				let a = Math.min(index, currentlyHoveredIndex);
				let b = Math.max(index, currentlyHoveredIndex);

				for (let i = a; i <= b; i++) {
					penInNote(keyRowClicked, i);
				}

				setCurrentlyHoveredIndex(index);
			}
		} else if (erasing) {
			const index = getBeatIndexOfMouse(event);
			if (index !== penDragStartIndex && index !== currentlyHoveredIndex) {
				let a = Math.min(index, currentlyHoveredIndex);
				let b = Math.max(index, currentlyHoveredIndex);

				for (let i = a; i <= b; i++) {
					// penInNote(keyRowClicked, i);
					const startOfBeat = (TOTAL_BEATS * i) / timeDivision;
					removeNote(keyRowClicked, startOfBeat);
					console.log("removing " + i);
				}

				setCurrentlyHoveredIndex(index);
			}
		}
	}

	function handlePenUp() {
		setPenDragging(false);
		setErasing(false);
		setCurrentlyHoveredIndex(null);
	}

	return {
		penRemoveBeat,
		penAddBeat,
		handlePenDrag,
		handlePenUp,
	};
}
