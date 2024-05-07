import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";

function PianoRoll({ keys }) {
	const KEY_HEIGHT = 30;
	const PIANO_WIDTH = 30;
	return (
		<div>
			<KeysColumn keys={keys} keyHeight={KEY_HEIGHT} keyWidth={PIANO_WIDTH} />
			<MidiTimeline
				keys={keys}
				leftSidePosition={PIANO_WIDTH}
				keyHeight={KEY_HEIGHT}
				minWidth={500}
			/>
		</div>
	);
}

export default PianoRoll;
