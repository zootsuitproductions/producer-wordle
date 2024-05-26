//user on mouse move in the midi timeline. calculate x position.
import { useState, useRef } from "react";

export default function useMultiNoteSelection({
	pianoWidth,
	leftPosition,
	notes,
}) {
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

	const selectNotes = () => {
		const x1 = Math.max(Math.min(startPoint.x, endPoint.x), 0);
		const y1 = Math.max(Math.min(startPoint.y, endPoint.y), 0);
		const x2 = Math.max(startPoint.x, endPoint.x);
		const y2 = Math.min(
			Math.max(startPoint.y, endPoint.y),
			containerRef.current.offsetHeight
		);

		//i could calculate the beat start and end instead, write a function to select between on
		// the midi data, instead of using dom shit

		// also, i should seperate these hooks for now make everything less headachey

		const noteElements = document.querySelectorAll(`.${"note"}`);
		console.log(noteElements.length);
		const selected = Array.from(noteElements).filter((note) => {
			const noteRelativeRect = note.getBoundingClientRect();
			// const noteRelativeRect = {
			// 	top: noteRect.top - parentTop,
			// 	right: noteRect.right - parentLeft,
			// 	bottom: noteRect.bottom - parentTop,
			// 	left: noteRect.left - parentLeft,
			// };

			return !(
				noteRelativeRect.right < x1 ||
				noteRelativeRect.left > x2 ||
				noteRelativeRect.bottom < y1 ||
				noteRelativeRect.top > y2
			);
		});

		console.log(selectNotes.length);

		// setSelectedNotes(selected);
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
