import { memo } from "react";
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
	console.log("re render rows");
	return (
		<div style={{ display: "flex", flexDirection: "column-reverse" }}>
			{sampleFiles.map((_, index) => {
				return (
					<KeyTimeline
						timeDivision={timeDivision}
						numBeats={TOTAL_BEATS}
						key={index}
						keyNumber={index}
						midiNotes={midiDataByNote[index]}
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
