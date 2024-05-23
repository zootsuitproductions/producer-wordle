import React from "react";
import { useEffect, useState } from "react";
import "../CSS/KeyTimeline.css";

function MidiBeat({
	removeBeat,
	startTime,
	endTime,
	penModeActivated = true,
	width,
	rowHeight,
	correct,
	numBeats = 16,
}) {
	const handleDoubleClick = () => {
		removeBeat();
	};

	const handleClick = () => {
		if (penModeActivated) {
			handleDoubleClick(startTime);
		}
	};

	// need to account for doubling beat divisions. keep track of beat state not by index but by map and default

	return (
		<div
			key={startTime}
			onDoubleClick={() => handleDoubleClick()}
			onMouseDown={() => handleClick()}
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
