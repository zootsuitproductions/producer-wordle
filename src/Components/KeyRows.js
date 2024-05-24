import { memo, useState } from "react";
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
	penModeActivated,
}) {
	const { handleBeatClick, handleMouseDown, handleMouseMove, handleMouseUp } =
		useMidiEditorMouseFeatures({
			penModeActivated,
			addNoteAndClearSpaceAsNecessary,
			removeNote,
			timeDivision,
			TOTAL_BEATS,
		});

	const [selectedBeats, setSelectedBeats] = useState([]);

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
