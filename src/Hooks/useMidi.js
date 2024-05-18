import { useState, useEffect } from "react";

export default function useMidi(midiData) {
	function getNextBeatsAfter(currentBeat) {
		let left = 0;
		let right = midiData.length - 1;
		let result = -1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);

			if (midiData[mid].startBeat > currentBeat) {
				result = mid;
				right = mid - 1; // Search in the left half
			} else {
				left = mid + 1; // Search in the right half
			}
		}

		if (result === -1) {
			return null;
		}

		const nextBeatStart = midiData[result].startBeat;
		const nextBeats = [midiData[result]];

		// Collect all events that occur at the same startBeat
		for (let i = result + 1; i < midiData.length; i++) {
			if (midiData[i].startBeat === nextBeatStart) {
				nextBeats.push(midiData[i]);
			} else {
				break;
			}
		}

		return nextBeats;
	}

	return {
		midiData,
		getNextBeatsAfter,
	};
}
