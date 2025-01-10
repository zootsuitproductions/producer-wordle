import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";
import CorrectAudioPlayer from "./CorrectAudioPlayer";
import PlaybackTools from "./PlaybackTools";

function App() {
	//todo this is bad
	const [sampleFiles, setSampleFiles] = useState(null);
	//on itialization, load all samples into an array from a folder in public called end of the road boys samples
	useEffect(() => {
		const loadSamples = async () => {
			// const sampleNames = [
			// 	"Hi Hat.wav",
			// 	"Kick.wav",
			// 	"Low Hat.wav",
			// 	"Snare Hi.wav",
			// 	"Snare.wav",
			// ];
			// const samples = sampleNames.map((name) => {
			// 	return `end of the road boyz samples/${name}`;
			// });
			const sampleNames = [
				"_ Perc.wav",
				"_ Clap.wav",
				"_ Snare.wav",
				"_ Open Hat.wav",
				"_ Hat8.wav",
				"_ Hat4.wav",
			];
			const samples = sampleNames.map((name) => {
				return `hood_vamp/${name}`;
			});
			setSampleFiles(samples);
		};

		loadSamples();
	}, []);

	const [bpm, setBpm] = useState(140);
	const [noDrumsBpm] = useState(140);
	const [isDisplayingCorrect, setIsDisplayingCorrect] = useState(false);

	const [correctData] = useState(() => {
		const storedData = localStorage.getItem("correctMidiNoteEvents");
		return storedData ? JSON.parse(storedData) : []; // Default to an empty array
	});

	return (
		<div className="App">
			{/* <CorrectAudioPlayer
				correctAudioFile={"hoodvamp.wav"}
				currentBpm={bpm}
				songBpm={noDrumsBpm}
			/> */}

			<PlaybackTools
				bpm={bpm}
				setBpm={setBpm}
				isDisplayingCorrect={isDisplayingCorrect}
				setIsDisplayingCorrect={setIsDisplayingCorrect}
			/>
			{sampleFiles && (
				<PianoRoll
					keys={sampleFiles}
					bpm={bpm}
					noDrumsWav={"hoodvamp_nodrums.wav"}
					noDrumsBpm={noDrumsBpm}
					correctData={correctData}
					isDisplayingCorrect={isDisplayingCorrect}
				/>
			)}
		</div>
	);
}

export default App;
