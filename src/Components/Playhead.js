import { useEffect, useState } from "react";

export default function Playhead({
	isPlaying,
	getCurrentPosition,
	timelineWidth,
}) {
	const [positionFraction, setPositionFraction] = useState(0);

	useEffect(() => {
		if (isPlaying) {
			const intervalId = setInterval(() => {
				setPositionFraction(getCurrentPosition());
			}, 30);

			return () => {
				clearInterval(intervalId); // Cleanup interval on component unmount
			};
		}
	}, [isPlaying]);

	const style = {
		left: positionFraction * timelineWidth + "px",
		zIndex: "2",
	};

	return <div style={style} className="playhead"></div>;
}
