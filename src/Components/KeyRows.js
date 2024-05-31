import { useState } from "react";
import KeyTimeline from "./KeyTimeline";
import useMidiEditorMouseFeatures from "../Hooks/useMidiEditorMouseFeatures";

function KeyRows({
	sampleFiles,
	TOTAL_BEATS,
	timeDivision,
	midiDataByNote,
	addNoteAndClearSpaceAsNecessary,
	removeNote,
	keyHeight,
	pianoWidth,
	selectNotesBetweenRowsAndTimes,
	penModeActivated,
	moveSelectedNotes,
}) {
	const {
		containerRef,
		getSelectionBoxStyle,
		handleNoteMouseDown,
		handleEmptyTimelineClick,
		handleMouseLeave,
	} = useMidiEditorMouseFeatures({
		moveSelectedNotes,
		selectNotesBetweenRowsAndTimes,
		keyHeight,
		penModeActivated,
		addNoteAndClearSpaceAsNecessary,
		removeNote,
		timeDivision,
		TOTAL_BEATS,
		pianoWidth,
	});

	return (
		<div>
			<div
				ref={containerRef}
				onMouseLeave={handleMouseLeave}
				style={{
					display: "flex",
					flexDirection: "column-reverse",
					position: "relative",
				}}
			>
				{/* selection bounding box */}
				<div className="selection-box" style={getSelectionBoxStyle()}></div>
				{sampleFiles.map((_, keyRowIndex) => {
					return (
						<KeyTimeline
							timeDivision={timeDivision}
							numBeats={TOTAL_BEATS}
							handleMouseDown={
								(event, columnIndex) =>
									handleEmptyTimelineClick(event, keyRowIndex, columnIndex)
								// i can call 2 functions in here
							}
							handleNoteMouseDown={(event, midiNote) =>
								handleNoteMouseDown(event, keyRowIndex, midiNote)
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
		</div>
	);
}

export default KeyRows;
