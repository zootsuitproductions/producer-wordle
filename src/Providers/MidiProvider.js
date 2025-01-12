import React, { createContext, useContext } from "react";
import useAudioMidiPlayer from "../Hooks/useAudioMidiPlayer";
import useMidi from "../Hooks/useMidi";
import useMidiEditorKeyControls from "../Hooks/useMidiEditorKeyControls";

const MidiContext = createContext();

export const MidiProvider = ({
	children,
	sampleFiles,
	noDrumsWav,
	noDrumsBpm,
	bpm,
	correctData,
	isDisplayingCorrect,
	TOTAL_BEATS = 16,
}) => {
	const midi = useMidi(sampleFiles);
	const audioMidiPlayer = useAudioMidiPlayer({
		sampleFiles,
		midiDataSorted: midi.midiDataSorted,
		correctData,
		bpm,
		TOTAL_BEATS,
		noDrumsWav,
		noDrumsBpm,
		isDisplayingCorrect,
	});
	const midiEditorKeyControls = useMidiEditorKeyControls({
		togglePlay: audioMidiPlayer.togglePlay,
		checkForCorrectness: midi.checkForCorrectness,
		saveToLocalStorage: midi.saveToLocalStorage,
		removeSelectedBeats: midi.removeSelectedBeats,
		commitSelectionMovement: midi.commitSelectionMovement,
		TOTAL_BEATS,
	});

	return (
		<MidiContext.Provider
			value={{ midi, audioMidiPlayer, midiEditorKeyControls }}
		>
			{children}
		</MidiContext.Provider>
	);
};

export const useMidiContext = () => useContext(MidiContext);
