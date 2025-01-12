import { useEffect, useState } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";
import TopOfTimeline from "./TopOfTimeline";
import Playhead from "./Playhead";
import KeyRows from "./KeyRows";
import StartMarker from "./StartMarker";
import { useMidiContext } from "../Providers/MidiProvider";

function MidiTimeline({
	sampleFiles,
	leftSidePosition,
	keyHeight,
	minWidth,
	noDrumsWav,
	noDrumsBpm,
	bpm,
	correctData,
	isDisplayingCorrect,
}) {
	const MAX_LEFT = leftSidePosition;
	const MIN_RIGHT = MAX_LEFT + minWidth;
	const [pianoWidth, setPianoWidth] = useState(minWidth);
	const [leftPosition, setLeftPosition] = useState(MAX_LEFT);

	const { midi, audioMidiPlayer, midiEditorKeyControls } = useMidiContext();

	const TOTAL_BEATS = 16;

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

	const [startMarkerTime, setStartMarkerTime] = useState(0.5);

	return (
		<div style={containerStyle}>
			<StartMarker timelineWidth={pianoWidth} startPosition={startMarkerTime} />
			<Playhead
				timelineWidth={pianoWidth}
				getCurrentPosition={() =>
					audioMidiPlayer.getCurrentBeat() / TOTAL_BEATS
				}
				isPlaying={audioMidiPlayer.isPlaying}
			/>
			<TopOfTimeline timeDivision={midiEditorKeyControls.timeDivision} />
			<KeyRows
				sampleFiles={sampleFiles}
				TOTAL_BEATS={TOTAL_BEATS}
				timeDivision={midiEditorKeyControls.timeDivision}
				midiDataByNote={midi.midiDataByNote}
				addNoteAndClearSpaceAsNecessary={midi.addNoteAndClearSpaceAsNecessary}
				addMultNotesToKeyRow={midi.addMultNotesToKeyRow}
				removeNote={midi.removeNote}
				keyHeight={keyHeight}
				pianoWidth={pianoWidth}
				penModeActivated={midiEditorKeyControls.penModeActivated}
				selectNotesBetweenRowsAndTimes={midi.selectNotesBetweenRowsAndTimes}
				moveSelectedNotes={midi.moveSelectedNotes}
				commitSelectionMovement={midi.commitSelectionMovement}
				setStartMarkerTime={setStartMarkerTime}
				isDisplayingCorrect={isDisplayingCorrect}
			/>
		</div>
	);
}

export default MidiTimeline;
