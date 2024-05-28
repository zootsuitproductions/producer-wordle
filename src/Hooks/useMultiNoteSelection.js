//user on mouse move in the midi timeline. calculate x position.
import { useState, useRef } from "react";

export default function useMultiNoteSelection({
	selectNotesBetweenRowsAndTimes,
	addNoteAndClearSpaceAsNecessary,
	pianoWidth,
	leftPosition,
	notes,
	keyHeight,
}) {
	const [isDragging, setIsDragging] = useState(false);
	const [noteElements, setNoteElements] = useState([]);
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);

	const handleSelectionMouseDown = (e) => {
		if (containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			setIsDragging(true);
			setStartPoint({ x: e.clientX - left, y: e.clientY - top });
			setEndPoint({ x: e.clientX - left, y: e.clientY - top });

			setNoteElements(document.querySelectorAll(`.${"note"}`));
		}
	};

	function handleSelectionMouseMove(e) {
		// find debugger pop up class like on sigma.io
		if (isDragging && containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			setEndPoint({ x: e.clientX - left, y: e.clientY - top });
			selectNotes();
		}
	}

	function handleSelectionUp() {
		setIsDragging(false);
	}

	const getSelectionBoxStyle = () => {
		if (isDragging) {
			// console.log();
			const x1 = Math.max(Math.min(startPoint.x, endPoint.x), 0);
			const y1 = Math.max(Math.min(startPoint.y, endPoint.y), 0);
			const x2 = Math.max(startPoint.x, endPoint.x);
			const y2 = Math.min(
				Math.max(startPoint.y, endPoint.y),
				containerRef.current.offsetHeight - 1
			);

			return {
				position: "absolute",
				outline: "solid 1px white",
				left: x1,
				top: y1,
				width: x2 - x1,
				height: y2 - y1,
				zIndex: "4",
			};
		} else {
			return {};
		}
	};

	const selectNotes = () => {
		const x1 = Math.max(Math.min(startPoint.x, endPoint.x), 0);
		const y1 = Math.max(Math.min(startPoint.y, endPoint.y), 0);
		const x2 = Math.max(startPoint.x, endPoint.x);
		const y2 = Math.min(
			Math.max(startPoint.y, endPoint.y),
			containerRef.current.offsetHeight - 1
		);

		const beatTimeLeft = 16 * (x1 / pianoWidth);
		const beatTimeRight = 16 * (x2 / pianoWidth);

		const bottomKey = Math.floor(
			(containerRef.current.offsetHeight - y2) / keyHeight
		);
		const topKey = Math.floor(
			(containerRef.current.offsetHeight - y1) / keyHeight
		);

		selectNotesBetweenRowsAndTimes(
			bottomKey,
			topKey,
			beatTimeLeft,
			beatTimeRight
		);

		// addNoteAndClearSpaceAsNecessary(0, beatTimeLeft, beatTimeLeft + 1);

		// GET THE SELECTION BOX BY JQUERY TO GET ABSOLUTE POSITION
	};

	return {
		containerRef,
		startPoint,
		endPoint,
		isDragging,
		getSelectionBoxStyle,
		handleSelectionMouseMove,
		handleSelectionMouseDown,
		handleSelectionUp,
	};
}
