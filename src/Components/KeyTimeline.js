import { useEffect, useState } from "react";
import React from "react";
import "../CSS/KeyTimeline.css";
import { getDisplayTime, isBlackKey } from "../Services/utils";
import MidiBeat from "./MidiBeat";

function KeyTimeline({
	keyNumber,
	width,
	rowHeight,
	midiNotes,
	addNoteAndClearSpaceAsNecessary,
	penModeActivated = false,
	numBeats = 16,
	removeNote,
}) {
	const [blackKey, setBlackKey] = useState(false);

	// TODO:
	// - click and drag.

	useEffect(() => {
		setBlackKey(isBlackKey(keyNumber));
	}, []);

	const handleClick = (index) => {
		if (penModeActivated) {
			penInNote(index);
		}
	};

	function penInNote(index) {
		const startOfBeat = numBeats * (index / numBeats);
		const endOfBeat = numBeats * ((index + 1) / numBeats);
		addNoteAndClearSpaceAsNecessary(keyNumber, startOfBeat, endOfBeat);
	}

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
					onDoubleClick={() => penInNote(index)}
					b
					onClick={() => handleClick(index)}
					className={`Beat ${getBeatClass(index, blackKey)}`}
				></div>
			))}

			{midiNotes.map((midiNote) => (
				<MidiBeat
					startTime={midiNote.startBeat}
					endTime={midiNote.endBeat}
					width={width}
					rowHeight={rowHeight}
					removeBeat={() => removeNote(keyNumber, midiNote.startBeat)}
					penModeActivated={penModeActivated}
					numBars={numBeats}
				/>
			))}
		</div>
	);
}

export default KeyTimeline;
