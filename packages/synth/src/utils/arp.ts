import { ARP_NOTE_LOCATION, Sequence } from "../engine/midi/types";

export const toggleARPNote = (
    sequence: Sequence,
    { row, column }: ARP_NOTE_LOCATION
  ) => {
    const chord = sequence[row] ?? [];
  
    sequence[row] = chord;
  
    const index = chord.indexOf(column);
  
    if (index === -1) {
      chord.push(column);
    } else {
      chord.splice(index, 1);
    }
  
    return { ...sequence };
  };