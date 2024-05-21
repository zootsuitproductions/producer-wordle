// useMidi.js
import { useState, useEffect } from "react";

const useMidi = (keys) => {
	const [midiDataByNote, setMidiData] = useState(keys.map(() => ({})));
	const [midiDataSorted, setMidiDataSorted] = useState([]);

	useEffect(() => {
		const sortMidiDataByTime = () => {
			let sortedData = [];
			midiDataByNote.forEach((notes, noteIndex) => {
				for (let startBeat in notes) {
					sortedData.push({
						note: noteIndex,
						startBeat: parseFloat(startBeat) * 4,
						endBeat: notes[startBeat],
						velocity: 0.9, // Default velocity, adjust as necessary
					});
				}
			});
			sortedData.sort((a, b) => a.startBeat - b.startBeat);
			console.log(sortedData);

			setMidiDataSorted(sortedData);
		};

		sortMidiDataByTime();
	}, [midiDataByNote]);

	// todo make timing object oriented and clear.
	function addNoteAndClearSpaceAsNecessary(keyIndex, startOfBeat, endOfBeat) {
		const newMidiNotes = { ...midiDataByNote[keyIndex] };

		let startTimes = Object.keys(newMidiNotes).map((key) => parseFloat(key));

		//find and remove any times in startTimes that are within range startOfBeat to endOfBeat
		startTimes.forEach(function (startTime) {
			console.log(startTime);
			if (startTime >= startOfBeat && startTime < endOfBeat) {
				delete newMidiNotes[startTime];
			}
		});

		newMidiNotes[startOfBeat] = endOfBeat;

		setMidiData((prevMidiData) => {
			const newMidiData = [...prevMidiData]; // Create a shallow copy
			newMidiData[keyIndex] = newMidiNotes; // Update the copy with new notes
			return newMidiData; // Return the updated state
		});
	}

	function removeNote(keyIndex, startTime) {
		const newMidiNotes = { ...midiDataByNote[keyIndex] };

		if (newMidiNotes[startTime]) {
			delete newMidiNotes[startTime];
		}

		setMidiData((prevMidiData) => {
			const newMidiData = [...prevMidiData]; // Create a shallow copy
			newMidiData[keyIndex] = newMidiNotes; // Update the copy with new notes
			return newMidiData; // Return the updated state
		});
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
