import { useEffect, useState } from "react";
import React from "react";
import "../CSS/KeyRow.css";
import { isBlackKey } from "../Services/utils";
import MidiBeat from "./MidiBeat";

function KeyTimeline({
	keyNumber,
	numBeats,
	onBeatClick,
	width,
	rowHeight,
	penModeActivated = false,
}) {
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

	const handleClick = (index) => {
		if (penModeActivated) {
			addBeatAndClearSpaceAsNecessary(index);
		}
	};

	const addBeatAndClearSpaceAsNecessary = (index) => {
		const startOfBeat = index / numBeats;
		const endOfBeat = (index + 1) / numBeats;

		const newMidiNotes = { ...midiNotes };

		let startTimes = Object.keys(newMidiNotes).map((key) => parseFloat(key));
		// startTimes.sort();

		//find and remove any times in startTimes that are within range startOfBeat to endOfBeat
		startTimes.forEach(function (startTime) {
			console.log(startTime);
			if (startTime >= startOfBeat && startTime < endOfBeat) {
				delete newMidiNotes[startTime];
			}
		});

		newMidiNotes[startOfBeat] = endOfBeat;

		setMidiNotes(newMidiNotes);
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
					onDoubleClick={() => addBeatAndClearSpaceAsNecessary(index)}
					onClick={() => handleClick(index)}
					className={`Beat ${blackKey ? "Black" : ""}`}
				></div>
			))}

			{Object.entries(midiNotes).map(([startTime, endTime]) => (
				<MidiBeat
					startTime={startTime}
					endTime={endTime}
					width={width}
					rowHeight={rowHeight}
					removeBeat={removeBeat}
					penModeActivated={penModeActivated}
				/>
				// <div
				// 	key={startTime}
				// 	onDoubleClick={() => removeBeat(startTime)}
				// 	// onClick={() => handleClick(index)}
				// 	style={{
				// 		position: "absolute",
				// 		left: startTime * width + "px",
				// 		width: (endTime - startTime) * width + "px",
				// 		height: `${rowHeight}px`,
				// 		backgroundColor: "red",
				// 	}}
				// ></div>
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
