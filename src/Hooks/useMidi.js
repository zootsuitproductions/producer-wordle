// useMidi.js
import { useState, useEffect } from "react";
import MidiNote from "../Models/MidiNote";

const useMidi = (keys) => {
	const [midiDataByNote, setMidiData] = useState(keys.map(() => []));
	const [midiDataSorted, setMidiDataSorted] = useState([]);

	useEffect(() => {
		const sortMidiDataByTime = () => {
			let sortedData = [];

			midiDataByNote.forEach((keyNotes, noteIndex) => {
				keyNotes.forEach((note) => {
					sortedData.push(note);
				});
			});

			// Sort the data by startBeat
			sortedData.sort((a, b) => a.startBeat - b.startBeat);

			setMidiDataSorted(sortedData);
		};

		sortMidiDataByTime();
	}, [midiDataByNote]);

	// todo make timing object oriented and clear.
	function addNoteAndClearSpaceAsNecessary(keyIndex, startOfBeat, endOfBeat) {
		console.log(midiDataByNote);
		// const newMidiNotesOnThisKey = { ...midiDataByNote[keyIndex] };

		const newKeyNotes = [...midiDataByNote[keyIndex]];
		newKeyNotes.filter((midiNote) => {
			const startBeat = midiNote.startBeat;
			return !(startBeat >= startOfBeat && startBeat < endOfBeat);
		});

		newKeyNotes.push(
			new MidiNote({
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
		const newKeyNotes = [...midiDataByNote[keyIndex]];

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

	return {
		midiDataByNote,
		setMidiData,
		addNoteAndClearSpaceAsNecessary,
		removeNote,
		midiDataSorted,
	};
};

export default useMidi;
