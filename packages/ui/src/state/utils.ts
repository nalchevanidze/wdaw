import { TrackState, DAWState, Preset, MidiFragment } from '@wdaw/engine';

const mapCurrentTrack = (state: DAWState, f: (a: TrackState) => TrackState) =>
  mapTrack(state.currentTrack, state, f);

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
  f: (a: TrackState) => TrackState
): Partial<DAWState> => ({
  currentTrack: currentTrack,
  tracks: tracks.map((t, i) => (id === i ? f(t) : t))
});

export const mapPreset = (state: DAWState, f: (a: Preset) => Partial<Preset>) =>
  mapCurrentTrack(state, ({ preset, ...rest }) => ({
    ...rest,
    preset: { ...preset, ...f(preset) }
  }));
