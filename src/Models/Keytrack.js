import MidiNoteEvent from "./MidiNoteEvent";

class Keytrack {
	constructor({ noteEvents = [] }) {
		this.noteEvents = noteEvents;
	}

	correctAgainst(correctKeytrack) {
		if (!(correctKeytrack instanceof Keytrack)) {
			return this;
		}

		const updatedNoteEvents = this.noteEvents.map((noteEvent) => {
			let isCorrect = false;

			for (let correctNoteEvent of correctKeytrack.noteEvents) {
				if (noteEvent.startTime === correctNoteEvent.startTime) {
					isCorrect = true;
					break;
				}
			}

			return new MidiNoteEvent({
				...noteEvent,
				correct: isCorrect,
			});
		});

		return new Keytrack({ noteEvents: updatedNoteEvents });
	}
}

export default Keytrack;
