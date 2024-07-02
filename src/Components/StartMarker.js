import { useEffect, useState } from "react";
import React from "react";

function StartMarker({ timelineWidth, startPosition }) {
	const style = {
		left: startPosition * timelineWidth + "px",
		zIndex: "2",
	};

	return <div style={style} className="startHead"></div>;
}

export default StartMarker;
