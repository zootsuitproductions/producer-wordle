import React from "react";
import { useEffect, useState } from "react";
import "../CSS/KeyTimeline.css";

function MidiBeat({
	removeBeat,
	startTime,
	endTime,
	penModeActivated = true,
	handleMouseDown,
	width,
	rowHeight,
	correct,
	numBeats = 16,
}) {
	const handleDoubleClick = () => {
		removeBeat();
	};

	return (
		<div
			className={"note"}
			key={startTime}
			onDoubleClick={() => handleDoubleClick()}
			onMouseDown={handleMouseDown}
			style={{
				position: "absolute",
				left: (startTime / numBeats) * width + "px",
				width: ((endTime - startTime) / numBeats) * width - 2 + "px",
				height: `${rowHeight - 2}px`,
				backgroundColor: correct ? "lightBlue" : "red",
				borderRadius: "1px",
				outline: "2px solid black",
			}}
		></div>
	);
}

export default MidiBeat;
