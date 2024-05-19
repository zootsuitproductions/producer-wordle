import { useEffect, useState } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";
import TopOfTimeline from "./TopOfTimeline";
import Playhead from "./Playhead";
import useAudioMidiPlayer from "../Hooks/useAudioPlayer";

function MidiTimeline({ keys, leftSidePosition, keyHeight, minWidth }) {
	const MAX_LEFT = leftSidePosition;
	const MIN_RIGHT = MAX_LEFT + minWidth;

	const [pianoWidth, setPianoWidth] = useState(minWidth);
	const [leftPosition, setLeftPosition] = useState(MAX_LEFT);
	const [timeDivision, setTimeDivision] = useState(32);
	const [penModeActivated, setPenModeActivated] = useState(false);

	const [midiDataByNote, setMidiData] = useState(
		keys.map((item) => {
			return {};
		})
	);
	const [midiDataSorted, setMidiDataSorted] = useState([]);

	const [bpm, setBpm] = useState(140);
	const TOTAL_BEATS = 16;

	const [playheadPosition, setPlayheadPosition] = useState(0);
	const { togglePlay } = useAudioMidiPlayer(
		midiDataSorted,
		bpm,
		TOTAL_BEATS,
		setPlayheadPosition
	);

	useEffect(() => {
		// Function to convert midiDataByNote to midiDataSorted
		const sortMidiDataByTime = () => {
			let sortedData = [];
			midiDataByNote.forEach((notes, noteIndex) => {
				for (let startBeat in notes) {
					sortedData.push({
						note: noteIndex,
						startBeat: parseFloat(startBeat) * 4,
						endBeat: notes[startBeat],
						velocity: 0.9, // Default velocity, adjust as necessary
					});
				}
			});
			sortedData.sort((a, b) => a.startBeat - b.startBeat);
			console.log(sortedData);

			setMidiDataSorted(sortedData);
		};

		sortMidiDataByTime();
	}, [midiDataByNote]);

	//Todo: need to clarify timing of measures and beats. 0 should be 1st bar, 1 should be 2nd bar.

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === "2") {
				console.log("2 key pressed");
				setTimeDivision(timeDivision * 2);
			} else if (event.key === "1") {
				console.log("1 key pressed");
				setTimeDivision(timeDivision / 2);
			} else if (event.key === "b") {
				const body = document.querySelector("body");
				if (!penModeActivated) {
					body.style.cursor = "crosshair";
				} else {
					body.style.cursor = "auto";
				}

				setPenModeActivated(!penModeActivated);
			} else if (event.key === " ") {
				togglePlay();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [timeDivision, penModeActivated, midiDataByNote, togglePlay]);

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
		width: `${pianoWidth}px`, // Assuming each key has a width of 100px
		flexDirection: "column",
		position: "absolute",
		backgroundColor: "#4F4F4F",
		left: `${leftPosition}px`,
	};

	const handleBeatClick = (keyIndex, beatIndex) => {
		console.log("clicked " + keyIndex + beatIndex);
	};

	const renderKeyRows = () => {
		const rows = [];
		for (let i = keys.length - 1; i >= 0; i--) {
			rows.push(
				<KeyTimeline
					numBeats={timeDivision}
					onBeatClick={(beatIndex) => handleBeatClick(i, beatIndex)}
					key={i}
					keyNumber={i}
					midiNotes={midiDataByNote[i]}
					setMidiNotes={(newNotes) => {
						console.log(midiDataByNote);
						setMidiData((prevMidiData) => {
							const newMidiData = [...prevMidiData]; // Create a shallow copy
							newMidiData[i] = newNotes; // Update the copy with new notes
							return newMidiData; // Return the updated state
						});
					}}
					rowHeight={keyHeight}
					width={pianoWidth}
					penModeActivated={penModeActivated}
				/>
			);
		}
		return rows;
	};

	return (
		<div style={containerStyle}>
			<Playhead
				timelineWidth={pianoWidth}
				positionFraction={playheadPosition}
			/>
			<TopOfTimeline timeDivision={timeDivision} />
			{renderKeyRows()}
		</div>
	);
}

export default MidiTimeline;
