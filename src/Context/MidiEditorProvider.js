import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
} from "react";
import MidiNoteEvent from "../Models/MidiNoteEvent";
import useMidi from "./useMidi";

const MidiContext = createContext();

export const MidiEditorProvider = ({ children }) => {
	const midi = useMidi([]);

	return <MidiContext.Provider value={midi}>{children}</MidiContext.Provider>;
};

export const useMidiContext = () => {
	return useContext(MidiContext);
};
