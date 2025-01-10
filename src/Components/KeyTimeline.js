import { useEffect, useState } from "react";
import React from "react";
import "../CSS/KeyTimeline.css";
import { isBlackKey } from "../Services/utils";
import MidiBeat from "./MidiBeat";

function KeyTimeline({
	keyNumber,
	width,
	rowHeight,
	midiNotes,
	handleMouseDown,
	handleNoteMouseDown,
	addNoteAndClearSpaceAsNecessary,
	penModeActivated = false,
	timeDivision = 16,
	numBeats = 16,
	removeNote,
	isDisplayingCorrect,
}) {
	const [blackKey, setBlackKey] = useState(false);

	// TODO:
	// - click and drag.

	useEffect(() => {
		setBlackKey(isBlackKey(keyNumber));
	}, [keyNumber]);

	function penInNote(index) {
		const startOfBeat = (numBeats * index) / timeDivision;

		console.log(startOfBeat);
		const endOfBeat = numBeats * ((index + 1) / timeDivision);
		addNoteAndClearSpaceAsNecessary(keyNumber, startOfBeat, endOfBeat);
	}

	const isBeatInLightColorSection = (index) => {
		return (index % (timeDivision / 2)) / timeDivision >= 0.25;
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
			key={keyNumber}
			style={{
				display: "flex",
				height: `${rowHeight}px`,
				flexDirection: "row",
				borderLeft: "1px solid white",
			}}
		>
			{Array.from({ length: timeDivision }).map((_, index) => (
				//Represents an individual beat on the key timeline
				<div
					key={index}
					onDoubleClick={() => penInNote(index)}
					onMouseDown={(event) => handleMouseDown(event, index)}
					className={`Beat ${getBeatClass(index, blackKey)}`}
				></div>
			))}

			{midiNotes.map((midiNote, index) => (
				<MidiBeat
					key={index}
					selected={midiNote.selected}
					startTime={midiNote.startBeat}
					endTime={midiNote.endBeat}
					correct={midiNote.correct}
					width={width}
					rowHeight={rowHeight}
					handleMouseDown={(event) => handleNoteMouseDown(event, midiNote)}
					removeBeat={() => removeNote(keyNumber, midiNote.startBeat)}
					penModeActivated={penModeActivated}
					numBars={timeDivision}
					isDisplayingCorrect={isDisplayingCorrect}
				/>
			))}
		</div>
	);
}

export default KeyTimeline;
