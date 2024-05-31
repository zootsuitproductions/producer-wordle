class MidiNoteEvent {
	static idCounter = 0;

	constructor({
		note,
		startBeat,
		endBeat,
		velocity = 0.9,
		correct = true,
		selected = false,
		id = null,
	}) {
		this.note = note; // MIDI note number
		this.startBeat = startBeat; // Start beat of the note
		this.endBeat = endBeat; // End beat of the note
		this.velocity = velocity; // Velocity of the note (default: 0.9)
		this.correct = correct; // Boolean indicating if the note is correct (default: true)
		if (!id) {
			this.id = MidiNoteEvent.getNextId();
		} // Generate a unique identifier
		this.selected = false;
	}

	static getNextId() {
		return MidiNoteEvent.idCounter++;
	}

	static clone(original) {
		return new MidiNoteEvent({
			note: original.note,
			startBeat: original.startBeat,
			endBeat: original.endBeat,
			velocity: original.velocity,
			correct: original.correct,
		});
	}
}

export default MidiNoteEvent;
