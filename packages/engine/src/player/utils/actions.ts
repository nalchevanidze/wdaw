import { Midi, MidiFragments } from '../../common/types';
import { keysToIndexes } from '../../utils/notes';
import { RecordLoop } from '../record';

export type NoteLoops = {
  size: number;
  loops: RecordLoop[];
};

export const toActions = (
  midis: Midi[],
  fragments: MidiFragments
): NoteLoops => {
  const loops = midis.map(({ end, start, fragmentId }): RecordLoop => {
    const { notes, loop } = fragments[fragmentId];

    const [loopStart, loopEnd] = loop;

    const record = new RecordLoop(start, end, loopEnd - loopStart);

    notes.forEach((note) => {
      const noteStart = note.at - loopStart;

      if (noteStart < 0) return;

      const key = keysToIndexes(note.id);

      record.startKey(noteStart, key);
      record.endKey(noteStart + note.length - 1, key);
    });

    return record;
  });

  const size = Math.max(...midis.map((m) => m.end));

  return { loops, size };
};
