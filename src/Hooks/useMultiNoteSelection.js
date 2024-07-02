import { useState, useRef } from "react";

export default function useMultiNoteSelection({
	selectNotesBetweenRowsAndTimes,
	pianoWidth,
	keyHeight,
	moveSelectedNotes,
	commitSelectionMovement,
	timeDivision,
	TOTAL_BEATS,
}) {
	const [isSelecting, setIsSelecting] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);

	const [selection, setSelection] = useState([]);
	const [selectionLeft, setSelectionLeft] = useState(null);
	const [selectionRight, setSelectionRight] = useState(null);

	const calculateRelativePosition = (e) => {
		if (containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			return { x: e.clientX - left, y: e.clientY - top };
		}
		return { x: 0, y: 0 };
	};

	const handleTimelineMouseDown = (e) => {
		const position = calculateRelativePosition(e);
		setIsSelecting(true);
		setStartPoint(position);
		setEndPoint(position);
		setSelection(selectNotes(position, position));
	};

	const handleNoteMouseDown = (e) => {
		const position = calculateRelativePosition(e);
		setStartPoint(position);
		setEndPoint(position);
		setIsDragging(true);

		//check if its on mouse is on note that isn't in the selection
		const selectionExists = selection.length > 0;
		if (!selectionExists) {
			setSelection(selectNotes(position, position));
		}
	};

	const handleMouseMove = (e) => {
		if (containerRef.current) {
			const position = calculateRelativePosition(e);
			if (isSelecting) {
				setEndPoint(position);
				setSelection(selectNotes(startPoint, position));
			} else if (isDragging) {
				const beatOffset = (16 * (position.x - startPoint.x)) / pianoWidth;
				moveSelectedNotes(beatOffset, TOTAL_BEATS, timeDivision);
			}
		}
	};

	const handleMouseUp = () => {
		setIsSelecting(false);
		if (isDragging) {
			commitSelectionMovement();
			setIsDragging(false);
		}
	};

	const getSelectionBoxStyle = () => {
		if (isSelecting) {
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

	const selectNotes = (startPoint, endPoint) => {
		const x1 = Math.max(Math.min(startPoint.x, endPoint.x), 0);
		const y1 = Math.max(Math.min(startPoint.y, endPoint.y), 0);
		const x2 = Math.max(startPoint.x, endPoint.x);
		const y2 = Math.min(
			Math.max(startPoint.y, endPoint.y),
			containerRef.current.offsetHeight - 1
		);

		const beatTimeLeft = 16 * (x1 / pianoWidth);
		const beatTimeRight = 16 * (x2 / pianoWidth);

		setSelectionLeft(Math.floor(beatTimeLeft));
		setSelectionRight(Math.ceil(beatTimeRight));

		const bottomKey = Math.floor(
			(containerRef.current.offsetHeight - y2) / keyHeight
		);
		const topKey = Math.floor(
			(containerRef.current.offsetHeight - y1) / keyHeight
		);

		return selectNotesBetweenRowsAndTimes(
			bottomKey,
			topKey,
			beatTimeLeft,
			beatTimeRight
		);
	};

	return {
		selection,
		selectionLeft,
		selectionRight,
		containerRef,
		getSelectionBoxStyle,
		handleSelectionMouseMove: handleMouseMove,
		handleSelectionMouseDown: handleTimelineMouseDown,
		handleSelectionUp: handleMouseUp,
		handleSelectionMouseDownOnNote: handleNoteMouseDown,
	};
}
