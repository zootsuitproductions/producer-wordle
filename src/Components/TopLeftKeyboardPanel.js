import { useState } from "react";
function TopLeftKeyboardPanel({ height = 60 }) {
	const [soundIsOn, setSoundIsOn] = useState(false);

	return (
		<div
			style={{
				height: height + "px",
				backgroundColor: "#3F3F3F",
				justifyContent: "flex-end",
				display: "flex",
				alignItems: "end",
			}}
		>
			<img
				onClick={() => setSoundIsOn(!soundIsOn)}
				src={soundIsOn ? "soundOn.png" : "soundOff.png"}
				style={{ margin: "2px", width: "23px" }}
			></img>
		</div>
	);
}

export default TopLeftKeyboardPanel;
