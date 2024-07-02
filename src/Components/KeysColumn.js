import "../App.css";
import React, { useEffect } from "react";
import { isBlackKey } from "../Services/utils";
import "../CSS/KeysColumn.css";
import TopOfTimeline from "./TopOfTimeline";
import TopLeftKeyboardPanel from "./TopLeftKeyboardPanel";

function KeysColumn({ keys, keyWidth, keyPlusSampleWidth = 200, keyHeight }) {
	var keysDisplay = [];

	function getFileNameFromPath(path) {
		// return path;
		// if (path instanceof String) {
		const parts = path.split("/");

		// Get the last part of the split path, which is the file name
		const fileName = parts[parts.length - 1];

		return fileName.split(".")[0];
		// }
		// Split the path by the directory separator (e.g., '/')

		// return fileName;
	}

	for (let i = keys.length - 1; i >= 0; i--) {
		const style = {
			width: keyWidth + "px",
			height: keyHeight + "px",
			backgroundColor: isBlackKey(i) ? "black" : "white",
			outline: "1px black solid",
		};

		keysDisplay.push(
			<div
				key={i}
				style={{
					display: "flex",
					flexDirection: "row",
					color: "white",
					width: keyPlusSampleWidth + "px",
					textAlign: "left",
					backgroundColor: "#3F3F3F",
				}}
			>
				<div
					style={{
						flex: "1",
						display: "flex",
						alignItems: "center",
						paddingLeft: "2px",
						outline: "1px black solid",
					}}
				>
					{getFileNameFromPath(keys[i])}
				</div>
				<div key={i} style={style}></div>
			</div>
		);
	}
	return (
		<div className="Keys-container">
			<TopLeftKeyboardPanel />
			{keysDisplay}
		</div>
	);
}

export default KeysColumn;
