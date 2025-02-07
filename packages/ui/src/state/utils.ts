import { TrackState, DAWState, Preset, MidiFragment } from '@wdaw/engine';

const mapCurrentTrack = (state: DAWState, f: (a: TrackState) => TrackState) =>
  mapTrack(state.tracks.currentTrack, state, f);

export const setMidiFragment = (
  id: string,
  { midiFragments }: DAWState,
  fields: Partial<MidiFragment>
) => ({
  midiFragments: {
    ...midiFragments,
    [id]: { ...midiFragments[id], fields }
  }
});

export const mapTrack = (
  target: number,
  { tracks: { tracks, currentTrack } }: DAWState,
  f: (a: TrackState) => TrackState
) => ({
  tracks: {
    currentTrack: currentTrack,
    tracks: tracks.map((t, i) => (target === i ? f(t) : t))
  }
});

export const mapPreset = (state: DAWState, f: (a: Preset) => Partial<Preset>) =>
  mapCurrentTrack(state, ({ preset, ...rest }) => ({
    ...rest,
    preset: { ...preset, ...f(preset) }
  }));
