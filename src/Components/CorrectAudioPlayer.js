import { useState, useRef } from "react";
import "../App.css";
export default function CorrectAudioPlayer({ correctAudioFile }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [timesPlayed, setTimesPlayed] = useState(0);

	const audioRef = useRef(new Audio(correctAudioFile));

	const playAudio = () => {
		const audio = audioRef.current;

		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
		} else {
			audio.play().catch((error) => {
				console.error("Failed to play audio:", error);
			});
			setTimesPlayed((prevState) => prevState + 1);
		}
		setIsPlaying(!isPlaying);
	};

	return (
		<div className="audio-player-container">
			<div onClick={playAudio} className="audio-player-circle">
				<img
					src={isPlaying ? "pause.png" : "play.png"}
					className={isPlaying ? "pause-icon" : "play-icon"}
					alt="Play"
					draggable="false"
				/>
			</div>
			<div style={{ marginLeft: "5px" }}> Times played: {timesPlayed}</div>
		</div>
	);
}
