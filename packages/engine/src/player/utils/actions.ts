import { NOTE_ACTION } from '../types';
import { Midi, NoteAction } from '../../types';
import { keysToIndexes } from '../../utils/notes';

const taskAt = (midi: NoteAction[], i: number, key: NOTE_ACTION): number[] => {
  const step = (midi[i] = midi[i] ?? {});

  switch (key) {
    case NOTE_ACTION.START: {
      const start = step.start ?? [];
      step.start = start;
      return start;
    }
    case NOTE_ACTION.END: {
      const end = step.end ?? [];
      step.end = end;
      return end;
    }
  }
};

type NoteLoop = NoteAction[];

export const NOTE_SIZE = 8;

export const toActions = ({
  notes,
  loop: [loopStart, loopEnd]
}: Midi): NoteLoop => {
  const size = (loopEnd - loopStart) * NOTE_SIZE;
  const output: NoteLoop = Array(size).fill(undefined);

  notes.forEach((note) => {
    const start = note.at - loopStart * NOTE_SIZE;
    if (start < 0) return;
    const end = start + note.length - 1;
    const key = keysToIndexes(note.id);

    taskAt(output, start, NOTE_ACTION.START).push(key);
    taskAt(output, end, NOTE_ACTION.END).push(key);
  });

  return output;
};
