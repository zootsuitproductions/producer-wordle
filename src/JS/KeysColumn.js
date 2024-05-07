import "../App.css";
import React, { useEffect } from "react";
import { isBlackKey } from "../Services/utils";
import "../CSS/KeysColumn.css";

function KeysColumn({ keys, keyWidth, keyHeight }) {
	var keysDisplay = [];

	for (let i = keys.length - 1; i >= 0; i--) {
		const style = {
			width: keyWidth + "px",
			height: keyHeight + "px",
			backgroundColor: isBlackKey(i) ? "black" : "white",
		};

		keysDisplay.push(<div key={i} style={style}></div>);
	}
	return <div className="Keys-container">{keysDisplay}</div>;
}

export default KeysColumn;
