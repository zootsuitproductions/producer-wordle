import React, { memo } from "react";
import "../CSS/TopOfTimeline.css";
import { useMidiContext } from "../Providers/MidiProvider";

function TopOfTimeline({ width, timeDivision, height = 60, onClick }) {
	const getDisplayTime = (index) => {
		const time = (8 * index) / timeDivision;
		let displayTime = Math.floor(time) + 1;

		switch (time % 1) {
			case 0.25:
				displayTime += 0.1;
				break;
			case 0.5:
				displayTime += 0.2;
				break;
			case 0.75:
				displayTime += 0.3;
				break;
			case 0:
				break;
			default:
				displayTime = "";
				break;
		}
		return displayTime;
	};

	const { audioMidiPlayer } = useMidiContext();

	const handleClick = (event) => {
		const rect = event.target.getBoundingClientRect();
		const parentRect = event.target.parentElement.getBoundingClientRect();
		const x = event.clientX - parentRect.left; // x position within the element
		const fraction = x / parentRect.width;
		audioMidiPlayer.togglePlay(fraction * 16);
	};

	return (
		<div
			className="Row-container top-timeline-speaker"
			style={{ height: height }}
			onClick={handleClick}
		>
			{Array.from({ length: timeDivision / 2 }).map((_, index) =>
				getDisplayTime(index) ===
				"" ? /*<div key={index} className="Time-marker-short"></div>*/ null : (
					<div key={index} className="Time-marker">
						{getDisplayTime(index)}
					</div>
				)
			)}
		</div>
	);
}

export default memo(TopOfTimeline);
