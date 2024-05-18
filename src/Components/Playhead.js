export default function Playhead(props) {
	const style = {
		left: props.positionFraction * props.timelineWidth + "px",
	};
	return <div style={style} className="playhead"></div>;
}
