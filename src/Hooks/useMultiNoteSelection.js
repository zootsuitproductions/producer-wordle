//user on mouse move in the midi timeline. calculate x position.
import { useState, useRef } from "react";

export default function useMultiNoteSelection({ pianoWidth, leftPosition }) {
	const [isDragging, setIsDragging] = useState(false);
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);

	const handleSelectionMouseDown = (e) => {
		if (containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			setIsDragging(true);
			setStartPoint({ x: e.clientX - left, y: e.clientY - top });
			setEndPoint({ x: e.clientX - left, y: e.clientY - top });
		}
	};

	function handleSelectionMouseMove(e) {
		// find debugger pop up class like on sigma.io
		if (isDragging && containerRef.current) {
			const { left, top } = containerRef.current.getBoundingClientRect();
			setEndPoint({ x: e.clientX - left, y: e.clientY - top });
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
				containerRef.current.offsetHeight
			);

			return {
				position: "absolute",
				outline: "solid 1px white",
				left: x1,
				top: y1,
				width: x2 - x1,
				height: y2 - y1,
			};
		} else {
			return {};
		}
	};

	return {
		containerRef,
		startPoint,
		endPoint,
		getSelectionBoxStyle,
		handleSelectionMouseMove,
		handleSelectionMouseDown,
		handleSelectionUp,
	};
}
