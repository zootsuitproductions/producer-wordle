import React from "react";
import "../CSS/TopOfTimeline.css";

function TopOfTimeline({ width, timeDivision, height = 60 }) {
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
		}
		return displayTime;
	};

	return (
		<div className="Row-container" style={{ height: height }}>
			{Array.from({ length: timeDivision / 2 }).map((_, index) => (
				<div className="Time-marker">{getDisplayTime(index)}</div>
			))}
		</div>
	);
}

export default TopOfTimeline;
