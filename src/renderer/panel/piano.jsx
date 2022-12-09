import React from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "./react-piano.js";
import "./piano.css";

export default function PanelPiano(props) {

  return (
      <Piano
        noteRange={{ first: 0, last: 11 }}
        playNote={(midiNumber) => {
          // Play a given note - see notes below
          let notes = [...props.state[props.settingKey].val];
          // console.log("notes, midiNumber", notes, midiNumber)
          if(notes.includes(midiNumber)) {
            // console.log("note already in array");
            notes.splice(notes.indexOf(midiNumber), 1);
          } else {
            notes.push(midiNumber);
          }
          notes = [...new Set(notes)]; // uniq
          notes.sort((a, b) => a - b); // sort
          props.state[props.settingKey].fn(notes);
        }}
        stopNote={(midiNumber) => {
          // don't do anything....
        }}
        activeNotes={props.state[props.settingKey].val}
        width={180}
        // keyboardShortcuts={keyboardShortcuts}
      />
  );
}
