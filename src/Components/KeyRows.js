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
	const [penDragging, setPenDragging] = useState(false);
	const [erasing, setErasing] = useState(false);

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
		if (penDragging) {
			const index = getBeatIndexOfMouse(event);
			if (index !== currentlyHoveredIndex) {
				setCurrentlyHoveredIndex(index);
				penInNote(keyRowClicked, index);
			}
		} else if (erasing) {
			const index = getBeatIndexOfMouse(event);
			if (index !== currentlyHoveredIndex) {
				setCurrentlyHoveredIndex(index);

				const startOfBeat = (TOTAL_BEATS * index) / timeDivision;
				removeNote(keyRowClicked, startOfBeat);
			}
		}
	}

	function getBeatIndexOfMouse(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const beatWidth = rect.width / timeDivision;
		return Math.floor(x / beatWidth);
	}

	function handleMouseDown(event, keyRowClicked, index) {
		if (penModeActivated) {
			// const index = getBeatIndexOfMouse(event);
			setClickedIndex(index);
			penInNote(keyRowClicked, index);
			setKeyRowClicked(keyRowClicked);
			setCurrentlyHoveredIndex(index);
			setPenDragging(true);
		}
	}

	function handleMouseUp() {
		setPenDragging(false);
		setErasing(false);
	}

	const [selectedBeats, setSelectedBeats] = useState([]);

	function handleBeatClick(event, keyRowClicked, midiNote) {
		if (penModeActivated) {
			console.log("beat clicked");
			removeNote(keyRowClicked, midiNote.startBeat);
			setKeyRowClicked(keyRowClicked);
			setErasing(true);
		} else {
			// selectBeat()
			// setSelectedBeats((prevSelection) => {
			// 	const newSelection = [...prevSelection];
			// 	newSelection.push(midiNote);
			// 	console.log(newSelection);
			// 	return newSelection;
			// });
		}
	}

	return (
		<div
			onMouseMove={handleMouseMove}
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
						handleBeatClick={(event, midiNote) =>
							handleBeatClick(event, keyRowIndex, midiNote)
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
