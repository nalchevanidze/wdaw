import { Midi } from "../midi/types";

const prelude: Midi = {
  size: 16,
  notes: {
    "0": [
      { at: 0, id: "C#3", length: 32 },
      { at: 0, id: "F#2", length: 32 },
      { at: 0, id: "D#1", length: 32 },
    ],
    "4": [
      { at: 0, id: "C#3", length: 32 },
      { at: 0, id: "F#2", length: 32 },
      { at: 0, id: "D#1", length: 32 },
    ],
    "8": [
      { at: 0, id: "F#2", length: 32 },
      { at: 0, id: "D#2", length: 32 },
      { at: 0, id: "C#1", length: 32 },
    ],
    "12": [
      { at: 0, id: "F#2", length: 32 },
      { at: 0, id: "D#2", length: 32 },
      { at: 0, id: "B0", length: 32 },
    ],
  },
};

export { prelude };
