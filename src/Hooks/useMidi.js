// useMidi.js
import { useState, useEffect } from "react";
import MidiNoteEvent from "../Models/MidiNoteEvent";

const useMidi = (keys) => {
	const [keytracksData, setMidiData] = useState(keys.map(() => []));
	const [midiDataSorted, setMidiDataSorted] = useState([]);
	//todo: SSoT. dekete midiDataByNote.
	// insert into sorted every time, expose a method to get the single key notes list,

	useEffect(() => {
		const sortMidiDataByTime = () => {
			let sortedData = [];

			keytracksData.forEach((keyNotes) => {
				keyNotes.forEach((note) => {
					sortedData.push(note);
				});
			});

			// Sort the data by startBeat
			sortedData.sort((a, b) => a.startBeat - b.startBeat);

			setMidiDataSorted(sortedData);
		};

		sortMidiDataByTime();
	}, [keytracksData]);

	// todo make timing object oriented and clear.
	function addNoteAndClearSpaceAsNecessary(keyIndex, startOfBeat, endOfBeat) {
		const newKeyNotes = [...keytracksData[keyIndex]];
		newKeyNotes.filter((midiNote) => {
			const startBeat = midiNote.startBeat;
			return !(startBeat >= startOfBeat && startBeat < endOfBeat);
		});

		newKeyNotes.push(
			new MidiNoteEvent({
				note: keyIndex, // MIDI note number (e.g., 60 for Middle C)
				startBeat: startOfBeat, // Start beat of the note
				endBeat: endOfBeat, // End beat of the note
			})
		);

		setMidiData((prevMidiData) => {
			const newMidiData = [...prevMidiData]; // Create a shallow copy
			newMidiData[keyIndex] = newKeyNotes; // Update the copy with new notes
			return newMidiData; // Return the updated state
		});
	}

	function removeNote(keyIndex, startTime) {
		const newKeyNotes = [...keytracksData[keyIndex]];

		const noteIndex = newKeyNotes.findIndex(
			(note) => note.startBeat === startTime
		);

		// If the note is found, remove it from the array
		if (noteIndex !== -1) {
			newKeyNotes.splice(noteIndex, 1);

			setMidiData((prevMidiData) => {
				const newMidiData = [...prevMidiData]; // Create a shallow copy
				newMidiData[keyIndex] = newKeyNotes; // Update the copy with new notes
				return newMidiData; // Return the updated state
			});
		}
	}

	function checkForCorrectness(correctKeytracksData) {
		correctKeytracksData.forEach((keytrack, noteIndex) => {
			keytracksData[noteIndex].correctAgainst(keytrack);
		});
	}

	return {
		midiDataByNote: keytracksData,
		setMidiData,
		addNoteAndClearSpaceAsNecessary,
		removeNote,
		midiDataSorted,
	};
};

export default useMidi;
