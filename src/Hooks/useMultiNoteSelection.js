//user on mouse move in the midi timeline. calculate x position.
import { useState, useRef } from "react";

export default function useMultiNoteSelection({
	selectNotesBetweenRowsAndTimes,
	pianoWidth,
	keyHeight,
	moveSelectedNotes,
}) {
	const [isSelecting, setIsSelecting] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);

	const handleSelectionMouseDown = (e) => {
		if (containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			setIsSelecting(true);
			setStartPoint({ x: e.clientX - left, y: e.clientY - top });
			setEndPoint({ x: e.clientX - left, y: e.clientY - top });
			selectNotes();
		}
	};

	function handleSelectionDragStart(e) {
		const { left, top } = containerRef.current.getBoundingClientRect();
		setStartPoint({ x: e.clientX - left, y: e.clientY - top });
		setEndPoint({ x: e.clientX - left, y: e.clientY - top });
		setIsDragging(true);
	}

	function handleSelectionDragMove(e) {
		const { left, top } = containerRef.current.getBoundingClientRect();
		const currentPoint = { x: e.clientX - left, y: e.clientY - top };

		const beatOffset = (16 * (currentPoint.x - startPoint.x)) / pianoWidth;
		moveSelectedNotes(beatOffset);
	}

	function handleSelectionMouseMove(e) {
		// find debugger pop up class like on sigma.io
		if (isSelecting && containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			setEndPoint({ x: e.clientX - left, y: e.clientY - top });
			selectNotes();
		} else if (isDragging) {
			handleSelectionDragMove(e);
		}
	}

	function handleSelectionUp() {
		setIsSelecting(false);
	}

	const getSelectionBoxStyle = () => {
		if (isSelecting) {
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
	};

	return {
		containerRef,
		getSelectionBoxStyle,
		handleSelectionMouseMove,
		handleSelectionMouseDown,
		handleSelectionUp,
		handleSelectionDragStart,
	};
}
