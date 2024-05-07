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
}) {
	const handleDoubleClick = () => {
		removeBeat(startTime);
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
			onClick={() => handleClick()}
			style={{
				position: "absolute",
				left: startTime * width + "px",
				width: (endTime - startTime) * width - 2 + "px",
				height: `${rowHeight - 2}px`,
				backgroundColor: "lightBlue",
				borderRadius: "1px",
				outline: "2px solid black",
			}}
		></div>
	);
}

export default MidiBeat;
