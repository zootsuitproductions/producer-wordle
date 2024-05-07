import { useEffect, useState } from "react";
import React from "react";
import "../CSS/KeyTimeline.css";
import { getDisplayTime, isBlackKey } from "../Services/utils";
import MidiBeat from "./MidiBeat";

function KeyTimeline({
	keyNumber,
	numBeats,
	onBeatClick,
	width,
	rowHeight,
	midiNotes,
	setMidiNotes,
	penModeActivated = false,
}) {
	//dictionary from start time to end time of midi
	// const [midiNotes, setMidiNotes] = useState({});

	const [blackKey, setBlackKey] = useState(false);

	// TODO:
	// - playback
	// - click and drag.

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

	// todo
	const addBeatAndClearSpaceAsNecessary = (index) => {
		const startOfBeat = index / numBeats;
		const endOfBeat = (index + 1) / numBeats;

		const newMidiNotes = { ...midiNotes };

		let startTimes = Object.keys(newMidiNotes).map((key) => parseFloat(key));

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

	const isBeatInLightColorSection = (index) => {
		return (index % (numBeats / 2)) / numBeats >= 0.25;
	};

	function getBeatClass(index, blackKey) {
		if (isBeatInLightColorSection(index)) {
			return blackKey ? "Lighter-black" : "Lighter-white";
		} else {
			return blackKey ? "Black" : "";
		}
	}

	return (
		<div
			style={{
				display: "flex",
				height: `${rowHeight}px`,
				flexDirection: "row",
				borderLeft: "1px solid white",
			}}
		>
			{Array.from({ length: numBeats }).map((_, index) => (
				<div
					key={index}
					onDoubleClick={() => addBeatAndClearSpaceAsNecessary(index)}
					onClick={() => handleClick(index)}
					className={`Beat ${getBeatClass(index, blackKey)}`}
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
			))}
		</div>
	);
}

export default KeyTimeline;
