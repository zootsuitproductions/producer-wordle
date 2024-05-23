// useMidi.js
import { useState, useEffect } from "react";
import MidiNoteEvent from "../Models/MidiNoteEvent";

const useMidi = (keys) => {
	const [keytracksData, setMidiData] = useState(keys.map(() => []));
	const [midiDataSorted, setMidiDataSorted] = useState([]);
	//todo: SSoT. dekete midiDataByNote.
	// insert into sorted every time, expose a method to get the single key notes list,
	function saveToLocalStorage() {
		localStorage.setItem("correctData", JSON.stringify(keytracksData));
	}

	useEffect(() => {
		const sortMidiDataByTime = () => {
			let sortedData = [];

			keytracksData.forEach((keytrack) => {
				keytrack.forEach((note) => {
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
	function addNoteAndClearSpaceAsNecessary(
		keyIndex,
		newNoteStartBeat,
		newNoteEndBeat
	) {
		const newKeytrack = [...keytracksData[keyIndex]].filter((existingNote) => {
			const exisitingBeatStart = existingNote.startBeat;

			// do not include existing beats that start during the new beat
			return !(
				exisitingBeatStart >= newNoteStartBeat &&
				exisitingBeatStart < newNoteEndBeat
			);
		});

		newKeytrack.push(
			new MidiNoteEvent({
				note: keyIndex, // MIDI note number (e.g., 60 for Middle C)
				startBeat: newNoteStartBeat, // Start beat of the note
				endBeat: newNoteEndBeat, // End beat of the note
			})
		);

		setMidiData((prevMidiData) => {
			const newMidiData = [...prevMidiData]; // Create a shallow copy
			newMidiData[keyIndex] = newKeytrack; // Update the copy with new notes

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

	const getKeytracksDataFromLocalStorage = () => {
		const data = localStorage.getItem("correctData");
		return data ? JSON.parse(data) : [];
	};

	function checkForCorrectness() {
		const correctKeytracksData = getKeytracksDataFromLocalStorage();
		setMidiData((prevKeyTracks) => {
			return prevKeyTracks.map((userKeytrack, noteIndex) => {
				const correctKeytrack = correctKeytracksData[noteIndex];
				console.log(correctKeytrack);

				const correctedKeytrack = userKeytrack.map((noteEvent) => {
					let isCorrect = false;
					for (let correctNoteEvent of correctKeytrack) {
						if (noteEvent.startBeat === correctNoteEvent.startBeat) {
							isCorrect = true;
							break;
						}
					}
					return new MidiNoteEvent({
						...noteEvent,
						correct: isCorrect,
					});
				});

				return correctedKeytrack;
			});
		});
	}

	return {
		midiDataByNote: keytracksData,
		addNoteAndClearSpaceAsNecessary,
		removeNote,
		checkForCorrectness,
		saveToLocalStorage,
		midiDataSorted,
	};
};

export default useMidi;
