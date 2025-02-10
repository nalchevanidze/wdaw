import { Midi, MidiFragments } from '../../common/types';
import { keysToIndexes } from '../../utils/notes';
import { RecordLoop } from '../record';

export type NoteLoops = {
  size: number;
  loops: NoteLoop[];
};

export type NoteLoop = {
  start: number;
  end: number;
  offset: number;
  record: RecordLoop;
};

export const toActions = (
  midis: Midi[],
  fragments: MidiFragments
): NoteLoops => {
  const loops = midis.map(({ end, start, fragmentId }): NoteLoop => {
    const { notes, loop } = fragments[fragmentId];

    const [loopStart, loopEnd] = loop;
    const size = loopEnd - loopStart;

    const record = new RecordLoop(size);

    notes.forEach((note) => {
      const noteStart = note.at - loopStart;

      if (noteStart < 0) return;

      const key = keysToIndexes(note.id);

      record.start(noteStart, key);
      record.end(noteStart + note.length - 1, key);
    });

    return {
      start,
      end,
      offset: start % size,
      record
    };
  });

  const size = Math.max(...midis.map((m) => m.end));

  return { loops, size };
};
