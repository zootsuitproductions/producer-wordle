import { memo, useState } from "react";
import KeyTimeline from "./KeyTimeline";

function KeyRows({
	sampleFiles,
	TOTAL_BEATS,
	timeDivision,
	midiDataByNote,
	addNoteAndClearSpaceAsNecessary,
	removeNote,
	keyHeight,
	pianoWidth,
	penModeActivated,
}) {
	const [mouseDown, setMouseDown] = useState(false);
	const [keyRowClicked, setKeyRowClicked] = useState(0);

	function penInNote(keyNumber, index) {
		const startOfBeat = (TOTAL_BEATS * index) / timeDivision;

		console.log(startOfBeat);
		const endOfBeat = TOTAL_BEATS * ((index + 1) / timeDivision);
		addNoteAndClearSpaceAsNecessary(keyNumber, startOfBeat, endOfBeat);
	}

	const [clickedIndex, setClickedIndex] = useState(null);
	const [currentlyHoveredIndex, setCurrentlyHoveredIndex] = useState(null);

	function handleMouseMove(event) {
		if (mouseDown) {
			const index = getBeatIndexOfMouse(event);
			if (index !== currentlyHoveredIndex) {
				setCurrentlyHoveredIndex(index);
				penInNote(keyRowClicked, index);
			}
		}
	}

	function getBeatIndexOfMouse(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const beatWidth = rect.width / timeDivision;
		return Math.floor(x / beatWidth);
	}
	//check if they leave the bounding rect/dont unclick properly. need to reset

	//ADDING DUPLICATES!. ALSO in keytimeline!

	//check if there is a beat in the way, stop. also. do removal

	function handleMouseDown(event, keyRowClicked, index) {
		if (penModeActivated) {
			// const index = getBeatIndexOfMouse(event);
			setClickedIndex(index);
			penInNote(keyRowClicked, index);
			setKeyRowClicked(keyRowClicked);
			setCurrentlyHoveredIndex(index);
			setMouseDown(true);
		}
	}

	function handleMouseUp() {
		setMouseDown(false);
	}

	return (
		<div
			onMouseMove={handleMouseMove}
			// onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			style={{ display: "flex", flexDirection: "column-reverse" }}
		>
			{sampleFiles.map((_, keyRowIndex) => {
				return (
					<KeyTimeline
						timeDivision={timeDivision}
						numBeats={TOTAL_BEATS}
						handleMouseDown={(event, columnIndex) =>
							handleMouseDown(event, keyRowIndex, columnIndex)
						}
						key={keyRowIndex}
						keyNumber={keyRowIndex}
						midiNotes={midiDataByNote[keyRowIndex]}
						addNoteAndClearSpaceAsNecessary={addNoteAndClearSpaceAsNecessary}
						removeNote={removeNote}
						rowHeight={keyHeight}
						width={pianoWidth}
						penModeActivated={penModeActivated}
					/>
				);
			})}
		</div>
	);
}

export default memo(KeyRows);
