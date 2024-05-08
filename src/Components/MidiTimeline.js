import { useEffect, useState, useRef } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";
import TopOfTimeline from "./TopOfTimeline";

const sound = new Audio("cc kick.wav");

function MidiTimeline({ keys, leftSidePosition, keyHeight, minWidth }) {
	const MAX_LEFT = leftSidePosition;
	const MIN_RIGHT = MAX_LEFT + minWidth;

	const [pianoWidth, setPianoWidth] = useState(minWidth);
	const [leftPosition, setLeftPosition] = useState(MAX_LEFT);
	const [timeDivision, setTimeDivision] = useState(32);
	const [penModeActivated, setPenModeActivated] = useState(false);
	const [midiData, setMidiData] = useState(
		keys.map((item) => {
			return {};
		})
	);
	const [bpm, setBpm] = useState(120);
	const oneBeatMS = 60000 / bpm;
	const numBars = 4;
	const beatsPerBar = 4;
	const oneBarMS = oneBeatMS * beatsPerBar;

	const [playheadPosition, setPlayheadPosition] = useState(0);

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

	function movePlayheadOverTime() {
		const totalMSToTravel4Bars = oneBarMS * 4;
		let elapsedTimeSinceStart = 0;
		const MSperFrame = 16;

		const interval = setInterval(() => {
			// Update playhead position based on time or other trigger
			setPlayheadPosition(
				(elapsedTimeSinceStart / totalMSToTravel4Bars) * pianoWidth
			);
			elapsedTimeSinceStart += MSperFrame;

			if (elapsedTimeSinceStart >= totalMSToTravel4Bars) {
				clearInterval(interval); // Stop the interval when the specified time is reached
			}
		}, MSperFrame); // Aim for ~60 FPS
	}

	//getting very messy, need audio playback engine
	function playMidi(startTime) {
		for (let i = 0; i < midiData.length; i++) {
			// console.log(midiData[i]);
			Object.keys(midiData[i]).forEach((item) => {
				// console.log(item);
				const scheduleTimeMS = item * oneBarMS;
				setTimeout(() => {
					playBeat();
					// setPlayheadPosition(pianoWidth * (item / numBars));
				}, scheduleTimeMS);

				movePlayheadOverTime();
			});
		}
	}

	//we can check if is playing to schedule new beats
	function playBeat() {
		sound.currentTime = 0; // Reset sound to start
		sound.play(); // Play sound
	}

	function startMetronome(bpm) {
		const interval = 60000 / bpm / 2; // Calculate time interval in milliseconds

		function scheduleBeat() {
			playBeat(); // Call function to play the beat
			setTimeout(scheduleBeat, interval); // Schedule next beat after interval
		}

		// Start the metronome by scheduling the first beat
		scheduleBeat();
	}

	useEffect(() => {
		// Replace with the path to your sound file

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
				console.log("space");
				playMidi(0);
				// startMetronome(160);
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [timeDivision, penModeActivated, midiData, containerRef]);

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

	const getBeatIndexOfMouse = (xPosition) => {
		return Math.floor(((xPosition - leftPosition) / pianoWidth) * timeDivision);
	};

	const rows = [];

	const renderKeyRows = () => {
		for (let i = keys.length - 1; i >= 0; i--) {
			rows.push(
				<KeyTimeline
					numBeats={timeDivision}
					onBeatClick={(beatIndex) => handleBeatClick(i, beatIndex)}
					key={i}
					keyNumber={i}
					midiNotes={midiData[i]}
					setMidiNotes={(newNotes) => {
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
		<div ref={containerRef} style={containerStyle}>
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
