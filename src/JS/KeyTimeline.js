import { useEffect, useState } from "react";
import React from "react";
import "../CSS/KeyRow.css";
import { isBlackKey } from "../Services/utils";

function KeyTimeline({ keyNumber, numBeats, onBeatClick, width, rowHeight }) {
	const [blackKey, setBlackKey] = useState(false);
	const [midiNotes, setMidiNotes] = useState({});

	useEffect(() => {
		setBlackKey(isBlackKey(keyNumber));
	}, []);

	const removeBeat = (startTime) => {
		const newMidiNotes = { ...midiNotes };

		if (newMidiNotes[startTime]) {
			delete newMidiNotes[startTime];
		}

		setMidiNotes(newMidiNotes);
	};

	const handleDoubleClick = (index) => {
		const startOfBeat = index / numBeats;
		const endOfBeat = (index + 1) / numBeats;

		const newMidiNotes = { ...midiNotes };

		//todo find overlapping
		if (newMidiNotes[startOfBeat]) {
			delete newMidiNotes[startOfBeat];
		} else {
			newMidiNotes[startOfBeat] = endOfBeat;
		}

		setMidiNotes(newMidiNotes);

		// midiNotes[startOfBeat] = endOfBeat;

		console.log(midiNotes);
	};

	// need to account for doubling beat divisions. keep track of beat state not by index but by map and default

	return (
		<div
			style={{
				display: "flex",
				height: `${rowHeight}px`,
				flexDirection: "row",
			}}
		>
			{Array.from({ length: numBeats }).map((_, index) => (
				<div
					key={index}
					onDoubleClick={() => handleDoubleClick(index)}
					className={`Beat ${blackKey ? "Black" : ""}`}
				></div>
			))}

			{Object.entries(midiNotes).map(([startTime, endTime]) => (
				<div
					key={startTime}
					onDoubleClick={() => removeBeat(startTime)}
					style={{
						position: "absolute",
						left: startTime * width + "px",
						width: (endTime - startTime) * width + "px",
						height: `${rowHeight}px`,
						backgroundColor: "red",
					}}
				></div>
			))}

			{/* <div
				style={{
					position: "absolute",
					left: (1 / 16) * width + "px",
					width: 1.5 * (1 / 16) * width + "px",
					height: "100%",
					top: "0",
					backgroundColor: "red",
				}}
			></div> */}
		</div>
	);
}

export default KeyTimeline;
