import { Midi, MidiFragments } from '../../common/types';
import { keysToIndexes } from '../../utils/notes';
import { RecordLoop } from '../record';

export type NoteLoops = {
  size: number;
  loops: NoteLoop[];
};

export type NoteLoop = {
  size: number;
  start: number;
  end: number;
  offset: number;
  notes: RecordLoop;
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

    const record = new RecordLoop(size);

    notes.forEach((note) => {
      const start = note.at - loopStart;

      if (start < 0) return;

      const end = start + note.length - 1;
      const key = keysToIndexes(note.id);

      record.start(start, key);
      record.end(end, key);
    });

    return {
      end: m.end,
      start: m.start,
      size,
      offset: m.start % size,
      notes: record
    };
  });

  return { loops, size };
};
