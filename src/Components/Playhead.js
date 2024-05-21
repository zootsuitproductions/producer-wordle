export default function Playhead(props) {
	const style = {
		left: props.positionFraction * props.timelineWidth + "px",
		zIndex: "2",
	};
	return <div style={style} className="playhead"></div>;
}
