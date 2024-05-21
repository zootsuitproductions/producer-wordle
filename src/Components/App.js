import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";

//dont worry about mobile
function App() {
	return (
		<div className="App">
			<h1>Play song audio</h1>
			{/* <PlaybackTimelineTest /> */}
			<PianoRoll keys={["kick", "clap", 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} />
		</div>
	);
}

export default App;
