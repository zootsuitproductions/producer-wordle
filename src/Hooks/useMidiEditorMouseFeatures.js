//user on mouse move in the midi timeline. calculate x position.
import { useState, useEffect } from "react";
import useMidiPen from "./useMidiPen";
import useMultiNoteSelection from "./useMultiNoteSelection";

export default function useMidiEditorMouseFeatures({
	penModeActivated,
	removeNote,
	addNoteAndClearSpaceAsNecessary,
	timeDivision,
	TOTAL_BEATS,
	pianoWidth,
	leftPosition,
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
		startPoint,
		endPoint,
		getSelectionBoxStyle,
		handleSelectionMouseMove,
		handleSelectionMouseDown,
		handleSelectionUp,
	} = useMultiNoteSelection({
		pianoWidth,
		leftPosition,
	});

	function handleNoteClick(event, keyRowClicked, midiNote) {
		if (penModeActivated) {
			penRemoveBeat(keyRowClicked, midiNote);
		} else {
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
		console.log("moving mouse");
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
		handleNoteClick,
		handleEmptyTimelineClick,
		handleMouseMove,
		handleMouseLeave,
	};
}
