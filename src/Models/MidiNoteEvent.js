class MidiNoteEvent {
	constructor({ note, startBeat, endBeat, velocity = 0.9, correct = true }) {
		this.note = note; // MIDI note number
		this.startBeat = startBeat; // Start beat of the note
		this.endBeat = endBeat; // End beat of the note
		this.velocity = velocity; // Velocity of the note (default: 0.9)
		this.correct = correct; // Boolean indicating if the note is correct (default: true)
	}
}

export default MidiNoteEvent;
