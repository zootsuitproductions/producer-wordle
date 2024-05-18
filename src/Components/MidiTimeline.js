import { useEffect, useState, useRef } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";
import TopOfTimeline from "./TopOfTimeline";
import { playMidi, getPlaybackPosition } from "../Services/AudioPlayback";
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

	const [bpm, setBpm] = useState(120);

	const [playheadPosition, setPlayheadPosition] = useState(0);

	const TOTAL_BEATS = 16;
	const { getCurrentBeat, togglePlay } = useAudioMidiPlayer(
		midiDataSorted,
		bpm
	);

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

	useEffect(() => {
		sortMidiDataByTime();
	}, [midiDataByNote]);

	//Todo: need to clarify timing of measures and beats. 0 should be 1st bar, 1 should be 2nd bar.

	//code to get parent height
	const containerRef = useRef(null);
	useEffect(() => {
		if (containerRef.current) {
			const parentHeight = containerRef.current.clientHeight;
			// Use parentHeight as needed
			console.log("Parent container height:", parentHeight);
		}
	}, [containerRef]);

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
	}, [timeDivision, penModeActivated, midiDataByNote, containerRef]);

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
	}, [pianoWidth]);

	const containerStyle = {
		// cursor: `crosshair, auto`,
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

	//todo: need concurrent logic
	// You can play back midi that you draw in! There is a bug with scheduling,
	// where if u delete a note while playing it will still play.need to unschedule that,
	// and perhaps dont schedule notes for so far in advance.only do it once we are within
	// the playhead update interval of the next beat, then schedule for a few ms in advance for precision

	useEffect(() => {
		const updatePlayheadPosition = () => {
			const currentBeat = getCurrentBeat();
			const fraction = currentBeat / TOTAL_BEATS;
			setPlayheadPosition(fraction);
		};

		const intervalId = setInterval(updatePlayheadPosition, 30); // Update every 100 milliseconds

		return () => {
			clearInterval(intervalId); // Cleanup interval on component unmount
		};
	}, [getCurrentBeat]);

	return (
		<div ref={containerRef} style={containerStyle}>
			<Playhead
				timelineWidth={pianoWidth}
				positionFraction={playheadPosition}
			/>
			<TopOfTimeline timeDivision={timeDivision} />
			{renderKeyRows()}
			<div
				style={{
					position: "absolute",
					top: "0px",
					left: playheadPosition + "px",
					width: "1px",
					height: containerRef.current
						? containerRef.current.clientHeight + "px"
						: "100%", //i want to read the height of the parent container
					borderLeft: "1px white solid",
					// zIndex: "2",
					color: "white",
				}}
			></div>
		</div>
	);
}

export default MidiTimeline;
