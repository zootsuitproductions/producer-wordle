import { useEffect, useState } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";
import TopOfTimeline from "./TopOfTimeline";
import Playhead from "./Playhead";
import useAudioMidiPlayer from "../Hooks/useAudioMidiPlayer";
import useMidi from "../Hooks/useMidi";
import useMidiEditorKeyControls from "../Hooks/useMidiEditorKeyControls";
import KeyRows from "./KeyRows";

function MidiTimeline({ sampleFiles, leftSidePosition, keyHeight, minWidth }) {
	const MAX_LEFT = leftSidePosition;
	const MIN_RIGHT = MAX_LEFT + minWidth;
	const [pianoWidth, setPianoWidth] = useState(minWidth);
	const [leftPosition, setLeftPosition] = useState(MAX_LEFT);

	const {
		midiDataByNote,
		addNoteAndClearSpaceAsNecessary,
		midiDataSorted,
		checkForCorrectness,
		saveToLocalStorage,
		removeNote,
		selectNotesBetweenRowsAndTimes,
		moveSelectedNotes,
	} = useMidi(sampleFiles);

	const [bpm, setBpm] = useState(101);
	const TOTAL_BEATS = 16;

	const { togglePlay, isPlaying, getCurrentBeat } = useAudioMidiPlayer(
		sampleFiles,
		midiDataSorted,
		bpm,
		TOTAL_BEATS
	);

	const { timeDivision, penModeActivated } = useMidiEditorKeyControls(
		togglePlay,
		checkForCorrectness,
		saveToLocalStorage
	);

	useEffect(() => {
		const handleZoom = (e) => {
			if (e.altKey || e.ctrlKey) {
				var scaleFactor = e.ctrlKey ? -50 : -5; //mouse vs trackpad sensitivity
				e.preventDefault();

				//0: calculate the mouse position - to box left
				//1: calculate what fraction of the box we are at
				//2: make the box bigger or smaller
				//3: multiply that fraction by the new size to get the new pixel distance to the mouse
				//     from the left side of the box
				//4: subtract that distance from mouse x to get the left side of box

				const mouseX = e.clientX;
				const mouseRelative = mouseX - leftPosition;
				const fractionOfBox = mouseRelative / pianoWidth;
				var newPianoWidth = Math.max(
					pianoWidth + scaleFactor * e.deltaY,
					minWidth
				); // make sure its not smaller than min width

				const newMouseRelative = fractionOfBox * newPianoWidth;
				const newLeftPosition = Math.min(mouseX - newMouseRelative, MAX_LEFT);

				if (newLeftPosition + newPianoWidth < MIN_RIGHT) {
					newPianoWidth = MIN_RIGHT - newLeftPosition;
				}

				setPianoWidth(newPianoWidth);
				setLeftPosition(newLeftPosition);
			} else if (e.deltaX !== 0) {
				e.preventDefault();
				setLeftPosition((prevLeft) => {
					const newPos = prevLeft - e.deltaX;
					if (newPos > MAX_LEFT) {
						return MAX_LEFT;
					} else if (newPos + pianoWidth < MIN_RIGHT) {
						return MIN_RIGHT - pianoWidth;
					} else {
						return newPos;
					}
				});
			}
		};

		document.addEventListener("wheel", handleZoom, { passive: false });

		return () => {
			document.removeEventListener("wheel", handleZoom);
		};
	}, [pianoWidth, MAX_LEFT, MIN_RIGHT, leftPosition, minWidth]);

	const containerStyle = {
		display: "flex",
		width: `${pianoWidth}px`,
		flexDirection: "column",
		position: "absolute",
		backgroundColor: "#4F4F4F",
		left: `${leftPosition}px`,
	};

	return (
		<div style={containerStyle}>
			<Playhead
				timelineWidth={pianoWidth}
				getCurrentPosition={() => getCurrentBeat() / TOTAL_BEATS}
				isPlaying={isPlaying}
			/>
			<TopOfTimeline timeDivision={timeDivision} />
			<KeyRows
				sampleFiles={sampleFiles}
				TOTAL_BEATS={TOTAL_BEATS}
				timeDivision={timeDivision}
				midiDataByNote={midiDataByNote}
				addNoteAndClearSpaceAsNecessary={addNoteAndClearSpaceAsNecessary}
				removeNote={removeNote}
				keyHeight={keyHeight}
				pianoWidth={pianoWidth}
				penModeActivated={penModeActivated}
				selectNotesBetweenRowsAndTimes={selectNotesBetweenRowsAndTimes}
				moveSelectedNotes={moveSelectedNotes}

				// onPenDrag
			/>
		</div>
	);
}

export default MidiTimeline;
