import { TrackState, Preset, MidiFragment } from '@wdaw/engine';
import { DAWState } from './types';

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

export const mapTracks = (
  { tracks }: DAWState,
  f: (a: TrackState, i: number) => Partial<TrackState>
): Partial<DAWState> => ({
  tracks: tracks.map((t, i) => ({ ...t, ...f(t, i) }))
});

export const mapTrack = (
  id: number,
  { tracks }: DAWState,
  f: (a: TrackState) => Partial<TrackState>
): Partial<DAWState> => ({
  tracks: tracks.map((t, i) => (id === i ? { ...t, ...f(t) } : t))
});

export const mapPreset = (
  id: string,
  { presets }: DAWState,
  f: (a: Preset) => Partial<Preset>
) => ({
  presets: { ...presets, [id]: { ...presets[id], ...f(presets[id]) } }
});
