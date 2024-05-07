import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";

//dont worry about mobile
function App() {
	return (
		<div className="App">
			<PianoRoll keys={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} />
		</div>
	);
}

export default App;