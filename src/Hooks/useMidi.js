// useMidi.js
import { useState, useEffect, useRef } from "react";
import MidiNoteEvent from "../Models/MidiNoteEvent";

const useMidi = (keys) => {
	const [keytracksData, setKeytracksData] = useState(keys.map(() => []));
	const [midiDataSorted, setMidiDataSorted] = useState([]);

	const [numIncorrect, setNumIncorrect] = useState(0);

	//todo: SSoT. dekete midiDataByNote.
	// insert into sorted every time, expose a method to get the single key notes list,
	function saveToLocalStorage() {
		localStorage.setItem("correctData", JSON.stringify(keytracksData));
		localStorage.setItem(
			"correctMidiNoteEvents",
			JSON.stringify(midiDataSorted)
		);
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
	}, [keytracksData, setMidiDataSorted]);

	// todo make timing object oriented and clear.
	function addNoteAndClearSpaceAsNecessary(
		keyIndex,
		newNoteStartBeat,
		newNoteEndBeat
	) {
		setKeytracksData((prevMidiData) => {
			// Create a shallow copy of the current key track data
			const newKeytrack = [...prevMidiData[keyIndex]].filter((existingNote) => {
				const exisitingBeatStart = existingNote.startBeat;

				// Do not include existing beats that start during the new beat
				return !(
					exisitingBeatStart >= newNoteStartBeat &&
					exisitingBeatStart < newNoteEndBeat
				);
			});

			// Add the new note to the key track
			newKeytrack.push(
				new MidiNoteEvent({
					note: keyIndex, // MIDI note number (e.g., 60 for Middle C)
					startBeat: newNoteStartBeat, // Start beat of the note
					endBeat: newNoteEndBeat, // End beat of the note
				})
			);

			// Create a shallow copy of the previous midi data
			const newMidiData = [...prevMidiData];
			// Update the copy with the new key track
			newMidiData[keyIndex] = newKeytrack;

			// Return the updated state
			return newMidiData;
		});
	}

	function addMultNotesToKeyRow(keyIndex, newNoteStartBeats, newNoteEndBeats) {
		if (newNoteEndBeats.length !== newNoteEndBeats.length) {
			throw new Error("start and end beat lists must be the same length!");
		}

		console.log("ADDING MULT");

		for (let i = 0; i < newNoteStartBeats.length; i++) {
			addNoteAndClearSpaceAsNecessary(
				keyIndex,
				newNoteStartBeats[i],
				newNoteEndBeats[i]
			);
		}
	}

	//todo
	function removeSelectedBeats() {
		setKeytracksData((prevState) => {
			const newMidiData = prevState.map((keytrack) => {
				if (keytrack) {
					return keytrack.filter((note) => !note.selected);
				}
				return keytrack;
			});
			return newMidiData;
		});
	}

	const selectedNoteStartPositions = useRef({});

	function commitSelectionMovement(beatOffset = 0) {
		selectedNoteStartPositions.current = {};
		setKeytracksData((prevState) => {
			const newMidiData = [...prevState];
			for (let i = 0; i < newMidiData.length; i++) {
				const keytrack = newMidiData[i];
				if (keytrack) {
					keytrack.forEach((note, index) => {
						if (note.selected) {
							console.log(note.startBeat);
							note.startBeat += beatOffset;
							note.endBeat += beatOffset;
							delete selectedNoteStartPositions.current[note.id];
							const clone = MidiNoteEvent.clone(note);
							keytrack[index] = clone;
							selectedNoteStartPositions.current[clone.id] = {
								startBeat: clone.startBeat,
								endBeat: clone.endBeat,
							};
						}
					});
				}
			}
			return newMidiData;
		});
	}

	// the moved notes
	function moveSelectedNotes(beatOffset, TOTAL_BEATS = 16, timeDivision = 32) {
		const clampInterval = TOTAL_BEATS / timeDivision;
		const tolerance = 0.25; // Define the tolerance fraction for clamping (e.g., 10%)

		//BRUH i need to clamp beat offset total
		let clamping = false;
		let clampDistance;

		setKeytracksData((prevState) => {
			const newMidiData = [...prevState];
			for (let i = 0; i < newMidiData.length; i++) {
				const keytrack = newMidiData[i];
				if (keytrack) {
					keytrack.forEach((note) => {
						// need to use the ealiest note

						if (note.selected) {
							note.startBeat =
								selectedNoteStartPositions.current[note.id].startBeat +
								beatOffset;
							note.endBeat =
								selectedNoteStartPositions.current[note.id].endBeat +
								beatOffset;

							const nearestClampStartBeat =
								Math.round(note.startBeat / clampInterval) * clampInterval;

							if (clamping) {
								note.startBeat = clampDistance + note.startBeat;
								note.endBeat = clampDistance + note.endBeat;
							} else if (
								Math.abs(note.startBeat - nearestClampStartBeat) < tolerance
							) {
								clamping = true;
								clampDistance = nearestClampStartBeat - note.startBeat;
								// setClampDistance(clampDistance);

								note.startBeat = clampDistance + note.startBeat;
								note.endBeat = clampDistance + note.endBeat;
							}
						}
					});
				}
			}
			return newMidiData;
		});
	}

	//lets do some deisgn work. stop cowboy coding
	function selectNotesBetweenRowsAndTimes(minKey, maxKey, startBeat, endBeat) {
		let selection = [];

		const newMidiData = keytracksData.map((keytrack, index) => {
			if (index < minKey || index > maxKey) {
				return keytrack.map((note) => {
					note.selected = false;
					return note;
				});
			} else {
				return keytrack.map((note) => {
					note.selected =
						note.endBeat >= startBeat && note.startBeat <= endBeat;
					if (note.selected) {
						selection.push(MidiNoteEvent.clone(note));
						selectedNoteStartPositions.current[note.id] = {
							startBeat: note.startBeat,
							endBeat: note.endBeat,
						};
					}
					return note;
				});
			}
		});

		setKeytracksData(newMidiData);

		return selection;
	}

	function removeNote(keyIndex, startTime) {
		setKeytracksData((prevKeytracksData) => {
			const newKeyNotes = [...prevKeytracksData[keyIndex]];
			const noteIndex = newKeyNotes.findIndex(
				(note) => note.startBeat === startTime
			);

			// If the note is found, remove it from the array
			if (noteIndex !== -1) {
				newKeyNotes.splice(noteIndex, 1);

				// setKeytracksData((prevMidiData) => {
				const newMidiData = [...prevKeytracksData]; // Create a shallow copy
				newMidiData[keyIndex] = newKeyNotes; // Update the copy with new notes
				return newMidiData; // Return the updated state
				// });
			} else {
				return prevKeytracksData;
			}
		});
		// const newKeyNotes = [...keytracksData[keyIndex]];

		// const noteIndex = newKeyNotes.findIndex(
		// 	(note) => note.startBeat === startTime
		// );

		// // If the note is found, remove it from the array
		// if (noteIndex !== -1) {
		// 	newKeyNotes.splice(noteIndex, 1);

		// 	setKeytracksData((prevMidiData) => {
		// 		const newMidiData = [...prevMidiData]; // Create a shallow copy
		// 		newMidiData[keyIndex] = newKeyNotes; // Update the copy with new notes
		// 		return newMidiData; // Return the updated state
		// 	});
		// }
	}

	const getKeytracksDataFromLocalStorage = () => {
		const data = localStorage.getItem("correctData");
		return data ? JSON.parse(data) : [];
	};

	function checkForCorrectness() {
		let numIncorrect1 = 0;
		const correctKeytracksData = getKeytracksDataFromLocalStorage();
		setKeytracksData((prevKeyTracks) => {
			return prevKeyTracks.map((userKeytrack, noteIndex) => {
				const correctKeytrack = correctKeytracksData[noteIndex];
				console.log(correctKeytrack);

				const correctedKeytrack = userKeytrack.map((noteEvent) => {
					let isCorrect = false;
					let endBeat = noteEvent.endBeat;
					for (let correctNoteEvent of correctKeytrack) {
						if (noteEvent.startBeat === correctNoteEvent.startBeat) {
							isCorrect = true;
							endBeat = correctNoteEvent.endBeat;
							break;
						}
					}
					if (!isCorrect) {
						numIncorrect1++;
					}
					if (isCorrect) {
						return noteEvent;
					}
					return new MidiNoteEvent({
						...noteEvent,
						endBeat: endBeat,
						correct: isCorrect,
					});
				});

				return correctedKeytrack;
			});
		});

		setNumIncorrect(numIncorrect1);
		return numIncorrect1;
	}

	function getNumberOfNotesUserIsMissing() {
		let numIncorrect1 = 0;
		const correctKeytracksData = getKeytracksDataFromLocalStorage();
		correctKeytracksData.forEach((correctKeytrack, noteIndex) => {
			const userKeytrack = keytracksData[noteIndex];
			// console.log(correctKeytrack);

			const _ = correctKeytrack.map((noteEvent) => {
				let isCorrect = false;
				let endBeat = noteEvent.endBeat;
				for (let userNoteEvent of userKeytrack) {
					if (noteEvent.startBeat === userNoteEvent.startBeat) {
						isCorrect = true;
						endBeat = userNoteEvent.endBeat;
						break;
					}
				}
				if (!isCorrect) {
					numIncorrect1++;
				}
				return new MidiNoteEvent({
					...noteEvent,
					endBeat: endBeat,
					correct: isCorrect,
				});
			});
		});

		//count the number of notes in each keytrack
		//if the count is not the same, return false
		return numIncorrect1;
	}

	return {
		removeSelectedBeats,
		selectNotesBetweenRowsAndTimes,
		midiDataByNote: keytracksData,
		addNoteAndClearSpaceAsNecessary,
		addMultNotesToKeyRow,
		removeNote,
		checkForCorrectness,
		saveToLocalStorage,
		midiDataSorted,
		moveSelectedNotes,
		commitSelectionMovement,
		numIncorrect,
		getNumberOfNotesUserIsMissing,
	};
};

export default useMidi;
