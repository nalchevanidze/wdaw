import { TrackState, DAWState, Preset, MidiFragment } from '@wdaw/engine';

export const setMidiFragment = (
  id: string,
  { midiFragments }: DAWState,
  fields: Partial<MidiFragment>
) => ({
  midiFragments: {
    ...midiFragments,
    [id]: { ...midiFragments[id], ...fields }
  }
});

export const mapTrack = (
  id: number,
  { tracks, currentTrack }: DAWState,
  f: (a: TrackState) => Partial<TrackState>
): Partial<DAWState> => ({
  currentTrack: currentTrack,
  tracks: tracks.map((t, i) => (id === i ? { ...t, ...f(t) } : t))
});

export const mapPreset = (
  id: string,
  { presets }: DAWState,
  f: (a: Preset) => Partial<Preset>
) => ({
  presets: { ...presets, [id]: { ...presets[id], ...f(presets[id]) } }
});
