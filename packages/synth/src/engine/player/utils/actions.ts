import { NOTE_ACTION } from '../types';
import { keysToIndexes } from '../../../utils/notes';
import { Midi, NoteAction } from '../../types';

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

export const toActions = (input: Midi): NoteAction[] => {
  const output: NoteAction[] = Array(input.size).fill(undefined);

  Object.entries(input.notes).forEach(([i, quarter]) => {
    quarter.forEach((note) => {
      const start = parseInt(i, 10) * 8 + note.at;
      const end = start + note.length - 1;
      const key = keysToIndexes(note.id);

      taskAt(output, start, NOTE_ACTION.START).push(key);
      taskAt(output, end, NOTE_ACTION.END).push(key);
    });
  });

  return output;
};
