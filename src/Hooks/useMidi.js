import { useState, useEffect } from "react";

export default function useMidi(midiData) {
	function getNextBeatAfter(currentBeat) {
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
		return result !== -1 ? midiData[result] : null;
	}

	return {
		midiData,
		getNextBeatAfter,
	};
}
