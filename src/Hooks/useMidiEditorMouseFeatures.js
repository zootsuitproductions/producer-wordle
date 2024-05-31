//user on mouse move in the midi timeline. calculate x position.
import { useEffect } from "react";
import useMidiPen from "./useMidiPen";
import useMultiNoteSelection from "./useMultiNoteSelection";

export default function useMidiEditorMouseFeatures({
	penModeActivated,
	removeNote,
	addNoteAndClearSpaceAsNecessary,
	timeDivision,
	TOTAL_BEATS,
	pianoWidth,
	keyHeight,
	selectNotesBetweenRowsAndTimes,
	moveSelectedNotes,
}) {
	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	const { penRemoveBeat, penAddBeat, handlePenDrag, handlePenUp } = useMidiPen({
		getBeatIndexOfMouse,
		removeNote,
		addNoteAndClearSpaceAsNecessary,
		timeDivision,
		TOTAL_BEATS,
	});

	const {
		containerRef,
		getSelectionBoxStyle,
		handleSelectionMouseMove,
		handleSelectionMouseDown,
		handleSelectionUp,
		handleSelectionDragStart,
	} = useMultiNoteSelection({
		moveSelectedNotes,
		selectNotesBetweenRowsAndTimes,
		pianoWidth,
		keyHeight,
	});

	function handleNoteMouseDown(event, keyRowClicked, midiNote) {
		if (penModeActivated) {
			penRemoveBeat(keyRowClicked, midiNote);
		} else {
			handleSelectionDragStart(event, keyRowClicked, midiNote);
			// handleBeatMouseDown(event, keyRowClicked, midiNote);
			// this breaks when trying to drag the whole selection. need to seperate these components
		}
	}

	function handleEmptyTimelineClick(event, keyRowClicked, index) {
		if (penModeActivated) {
			penAddBeat(keyRowClicked, index);
		} else {
			handleSelectionMouseDown(event);
		}
	}

	function getBeatIndexOfMouse(event) {
		const rect = containerRef.current.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const beatWidth = rect.width / timeDivision;
		return Math.floor(x / beatWidth);
	}

	function handleMouseMove(event) {
		if (penModeActivated) {
			handlePenDrag(event);
		} else {
			handleSelectionMouseMove(event);
		}
	}

	function handleMouseUp() {
		if (penModeActivated) {
			handlePenUp();
		} else {
			handleSelectionUp();
		}
	}

	function handleMouseLeave() {}

	return {
		containerRef,
		getSelectionBoxStyle,
		handleNoteMouseDown,
		handleEmptyTimelineClick,
		handleMouseMove,
		handleMouseLeave,
	};
}
