import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";

function PianoRoll({ keys }) {
	const KEY_HEIGHT = 30;
	const LEFT_PANEL_WIDTH = 200;
	const KEY_WIDTH = 30;
	return (
		<div>
			<KeysColumn
				keys={keys}
				keyHeight={KEY_HEIGHT}
				keyWidth={KEY_WIDTH}
				keyPlusSampleWidth={LEFT_PANEL_WIDTH}
			/>
			<MidiTimeline
				keys={keys}
				leftSidePosition={LEFT_PANEL_WIDTH}
				keyHeight={KEY_HEIGHT}
				minWidth={1000}
			/>
		</div>
	);
}

export default PianoRoll;
