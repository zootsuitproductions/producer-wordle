import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";

function PianoRoll({ keys: sampleFiles }) {
	const KEY_HEIGHT = 45;
	const LEFT_PANEL_WIDTH = 130;
	const KEY_WIDTH = 30;
	return (
		<div>
			<KeysColumn
				keys={sampleFiles}
				keyHeight={KEY_HEIGHT}
				keyWidth={KEY_WIDTH}
				keyPlusSampleWidth={LEFT_PANEL_WIDTH}
			/>
			<MidiTimeline
				sampleFiles={sampleFiles}
				leftSidePosition={LEFT_PANEL_WIDTH}
				keyHeight={KEY_HEIGHT}
				minWidth={1100}
			/>
		</div>
	);
}

export default PianoRoll;
