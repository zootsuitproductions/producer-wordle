import { useEffect, useState } from "react";
import React from "react";
import "../App.css";
import KeyTimeline from "./KeyTimeline";

function MidiTimeline({ keys, leftSidePosition, keyHeight, minWidth }) {
	// const MIN_WIDTH = 400;
	const MAX_LEFT = leftSidePosition;
	const MIN_RIGHT = MAX_LEFT + minWidth;

	const [pianoWidth, setPianoWidth] = useState(minWidth);
	const [leftPosition, setLeftPosition] = useState(MAX_LEFT);
	const [timeDivision, setTimeDivision] = useState(16);

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === "2") {
				console.log("2 key pressed");
				setTimeDivision(timeDivision * 2);
			} else if (event.key === "1") {
				console.log("1 key pressed");
				setTimeDivision(timeDivision / 2);
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [timeDivision]);

	// midi state. need map

	useEffect(() => {
		const handleZoom = (e) => {
			if (e.altKey || e.ctrlKey) {
				var scaleFactor = e.ctrlKey ? -4 : -1; //mouse vs trackpad sensitivity
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
					midiNotes={{}}
					rowHeight={keyHeight}
					width={pianoWidth}
				/>
			);
		}
		return rows;
	};

	return <div style={containerStyle}>{renderKeyRows()}</div>;
}

export default MidiTimeline;
