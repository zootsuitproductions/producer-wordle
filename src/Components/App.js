import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";
import CorrectAudioPlayer from "./CorrectAudioPlayer";

function App() {
	//todo this is bad
	const [sampleFiles, setSampleFiles] = useState(null);
	//on itialization, load all samples into an array from a folder in public called end of the road boys samples
	useEffect(() => {
		const loadSamples = async () => {
			const sampleNames = [
				"Hi Hat.wav",
				"Kick.wav",
				"Low Hat.wav",
				"Snare Hi.wav",
				"Snare.wav",
			];
			const samples = sampleNames.map((name) => {
				return `end of the road boyz samples/${name}`;
			});
			setSampleFiles(samples);
		};

		loadSamples();
	}, []);

	return (
		<div className="App">
			<CorrectAudioPlayer
				correctAudioFile={"end of the road boys no drums.wav"}
			/>
			{sampleFiles && <PianoRoll keys={sampleFiles} />}
		</div>
	);
}

export default App;
