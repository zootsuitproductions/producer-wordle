import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";
import CorrectAudioPlayer from "./CorrectAudioPlayer";

function App() {
	const [sampleFiles, setSampleFiles] = useState([
		"cc kick.wav",
		"/end of the road boyz samples/eotrb Snare.wav",
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
	]);
	//on itialization, load all samples into an array from a folder in public called end of the road boys samples
	useEffect(() => {
		const loadSamples = async () => {
			// As i add more samples it become a lot more laggy. test if it is the interface or the audio
			//
			// todo:::^^^

			const sampleNames = [
				// "Hi Hat.wav",
				// "Kick.wav",
				// "Low Hat.wav",
				// "Snare Hi.wav",
				"Snare.wav",
				// Add more sample file names here
			];
			const samples = sampleNames.map((name) => {
				return `end of the road boyz samples/eotrb ${name}`;
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
			{/* <PlaybackTimelineTest /> */}
			{/* ["kick", "clap", 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] */}
			<PianoRoll keys={sampleFiles} />
		</div>
	);
}

export default App;
