import "../App.css";
import KeysColumn from "./KeysColumn";
import MidiTimeline from "./MidiTimeline";
import { useEffect, useState } from "react";
import PianoRoll from "./PianoRoll";
import CorrectAudioPlayer from "./CorrectAudioPlayer";
import PlaybackTools from "./PlaybackTools";
import { MidiProvider } from "../Providers/MidiProvider";
import { getCorrectMidiNoteEvents } from "../Services/fallbackData";

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
				"Kick.wav",
				"Perc.wav",
				"Clap.wav",
				"Snare.wav",
				"Open Hat.wav",
				"Lo Hat.wav",
				"Hi Hat.wav",
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
	const [isDisplayingCorrect, setIsDisplayingCorrect] = useState(true);

	const [correctData] = useState(() => {
		// const storedData = localStorage.getItem("correctMidiNoteEvents");
		return getCorrectMidiNoteEvents();
		// return storedData ? JSON.parse() : []; // Default to an empty array
	});

	const MOVES_TO_WIN = 60;

	const [penModeActive, setPenModeActive] = useState(false);

	return (
		<div className="App">
			{sampleFiles && (
				<MidiProvider
					sampleFiles={sampleFiles}
					noDrumsWav={"hoodvamp_nodrums.wav"}
					noDrumsBpm={noDrumsBpm}
					bpm={bpm}
					correctData={correctData}
					isDisplayingCorrect={isDisplayingCorrect}
				>
					<h3
						style={{
							color: "white",
							paddingBottom: "20px",
							background: "black",
						}}
					>
						Draw in the drums from the Correct Beat in under {MOVES_TO_WIN}{" "}
						moves to win!
						<div style={{ fontSize: "12px", paddingTop: "5px" }}>
							(Playing the Correct Beat constitutes 1 move, slowing the tempo
							down counts as 5, and checking for correctness counts as 1 move
							per note you get wrong)
							<div>
								You can play the beat from the middle by clicking the top of the
								timeline at the desired position.
							</div>
						</div>
					</h3>
					<PlaybackTools
						bpm={bpm}
						setBpm={setBpm}
						isDisplayingCorrect={isDisplayingCorrect}
						setIsDisplayingCorrect={setIsDisplayingCorrect}
						penModeActive={penModeActive}
						MOVES_TO_WIN={MOVES_TO_WIN}
						setPenModeActive={setPenModeActive}
					/>
					<PianoRoll
						keys={sampleFiles}
						bpm={bpm}
						noDrumsWav={"hoodvamp_nodrums.wav"}
						noDrumsBpm={noDrumsBpm}
						correctData={correctData}
						isDisplayingCorrect={isDisplayingCorrect}
						penModeActive={penModeActive}
						setPenModeActive={setPenModeActive}
					/>
				</MidiProvider>
			)}
		</div>
	);
}

export default App;
