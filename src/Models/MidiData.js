import Keytrack from "./Keytrack";

class MidiData {
	constructor({ keys }) {
		this.keytracks = keys.map(new Keytrack());
	}
}
