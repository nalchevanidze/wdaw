import { NOTE_ACTION } from '../types';
import { Midi, MidiFragments, NoteAction } from '../../common/types';
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

export type NoteLoops = {
  size: number;
  loops: NoteLoop[];
};

export type NoteLoop = {
  size: number;
  start: number;
  end: number;
  offset: number;
  notes: NoteAction[];
};

export const toActions = (
  midis: Midi[],
  fragments: MidiFragments
): NoteLoops => {
  const size = Math.max(...midis.map((m) => m.end));
  const loops = midis.map((m): NoteLoop => {
    const { notes, loop } = fragments[m.fragmentId];

    const [loopStart, loopEnd] = loop;
    const size = loopEnd - loopStart;

    const output = Array(size).fill(undefined);

    notes.forEach((note) => {
      const start = note.at - loopStart;

      if (start < 0) return;
      const end = start + note.length - 1;
      const key = keysToIndexes(note.id);

      taskAt(output, start, NOTE_ACTION.START).push(key);
      taskAt(output, end, NOTE_ACTION.END).push(key);
    });

    return {
      end: m.end,
      start: m.start,
      size,
      offset: m.start % size,
      notes: output
    };
  });

  return { loops, size };
};
