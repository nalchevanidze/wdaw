import { MidiRef, MidiFragments } from '../../common/types';
import { keysToIndexes } from '../../utils/notes';
import { RecordLoop } from '../record';

export type NoteLoops = {
  size: number;
  loops: RecordLoop[];
};

export const toActions = (
  midiRefs: MidiRef[],
  fragments: MidiFragments
): NoteLoops => {
  const midis = midiRefs.flatMap(({ fragmentId, start, end }) =>
    fragmentId ? [{ start, end, fragmentId }] : []
  );

  const loops = midis.map(({ end, start, fragmentId }): RecordLoop => {
    const { notes, loop } = fragments[fragmentId];

    const [loopStart, loopEnd] = loop;

    const record = new RecordLoop(start, end, loopEnd - loopStart);

    notes.forEach((note) => {
      const noteStart = note.at - loopStart;

      if (noteStart < 0) return;

      const key = keysToIndexes(note.note);

      record.startKey(noteStart, key);
      record.endKey(noteStart + note.length - 1, key);
    });

    return record;
  });

  const size = Math.max(...midis.map((m) => m.end));

  return { loops, size };
};
