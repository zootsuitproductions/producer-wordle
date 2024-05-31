import React from "react";
import { useEffect, useState } from "react";
import "../CSS/KeyTimeline.css";

function MidiBeat({
	removeBeat,
	startTime,
	endTime,
	selected,
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
				borderRadius: selected ? "0px" : "1px",
				outline: selected ? "2px solid white" : "2px solid black",
			}}
		></div>
	);
}

export default MidiBeat;
