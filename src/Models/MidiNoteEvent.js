class MidiNoteEvent {
	static idCounter = 0;

	constructor({ note, startBeat, endBeat, velocity = 0.9, correct = true }) {
		this.note = note; // MIDI note number
		this.startBeat = startBeat; // Start beat of the note
		this.endBeat = endBeat; // End beat of the note
		this.velocity = velocity; // Velocity of the note (default: 0.9)
		this.correct = correct; // Boolean indicating if the note is correct (default: true)
		this.id = MidiNoteEvent.getNextId(); // Generate a unique identifier
	}

	static getNextId() {
		return MidiNoteEvent.idCounter++;
	}
}

export default MidiNoteEvent;
