import { useEffect, useState } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";
import TopOfTimeline from "./TopOfTimeline";
import Playhead from "./Playhead";
import useAudioMidiPlayer from "../Hooks/useAudioMidiPlayer";
import useMidi from "../Hooks/useMidi";
import useMidiEditorControls from "../Hooks/useMidiEditorControls";

function MidiTimeline({ sampleFiles, leftSidePosition, keyHeight, minWidth }) {
	const MAX_LEFT = leftSidePosition;
	const MIN_RIGHT = MAX_LEFT + minWidth;
	const [pianoWidth, setPianoWidth] = useState(minWidth);
	const [leftPosition, setLeftPosition] = useState(MAX_LEFT);
	const [playheadPosition, setPlayheadPosition] = useState(0);

	const {
		midiDataByNote,
		addNoteAndClearSpaceAsNecessary,
		midiDataSorted,
		checkForCorrectness,
		saveToLocalStorage,
		removeNote,
	} = useMidi(sampleFiles);

	const [bpm, setBpm] = useState(101);
	const TOTAL_BEATS = 16;

	const { togglePlay } = useAudioMidiPlayer(
		sampleFiles,
		midiDataSorted,
		bpm,
		TOTAL_BEATS,
		setPlayheadPosition
	);

	const { timeDivision, penModeActivated } = useMidiEditorControls(
		togglePlay,
		checkForCorrectness,
		saveToLocalStorage
	);

	useEffect(() => {
		const handleZoom = (e) => {
			if (e.altKey || e.ctrlKey) {
				var scaleFactor = e.ctrlKey ? -12 : -5; //mouse vs trackpad sensitivity
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

	const renderKeyRows = () => {
		return sampleFiles.map((_, index) => {
			console.log(timeDivision);
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
		});
	};

	return (
		<div style={containerStyle}>
			<Playhead
				timelineWidth={pianoWidth}
				positionFraction={playheadPosition}
			/>
			<TopOfTimeline timeDivision={timeDivision} />
			<div style={{ display: "flex", flexDirection: "column-reverse" }}>
				{renderKeyRows()}
			</div>
		</div>
	);
}

export default MidiTimeline;
