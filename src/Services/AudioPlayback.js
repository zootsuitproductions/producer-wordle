const sound = new Audio("cc kick.wav");
const bpm = 120;
const oneBeatMS = 60000 / bpm;
const numBars = 4;
const beatsPerBar = 4;
const oneBarMS = oneBeatMS * beatsPerBar;

//we can check if is playing to schedule new beats
function playBeat() {
	sound.currentTime = 0; // Reset sound to start
	sound.play(); // Play sound
}

export const getPlaybackPosition = () => {
	const totalMSToTravel4Bars = oneBarMS * 4;
	let elapsedTimeSinceStart = 1000;
	const MSperFrame = 16;
	// Update playhead position based on time or other trigger
	return elapsedTimeSinceStart / totalMSToTravel4Bars;
};

export const playMidi = (midiData) => {
	for (let i = 0; i < midiData.length; i++) {
		Object.keys(midiData[i]).forEach((item) => {
			const scheduleTimeMS = item * oneBarMS;
			setTimeout(() => {
				playBeat();
				// setPlayheadPosition(pianoWidth * (item / numBars));
			}, scheduleTimeMS);

			// movePlayheadOverTime();
		});
	}
};
