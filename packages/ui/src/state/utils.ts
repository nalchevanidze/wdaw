import { TrackState, Preset, MidiFragment } from '@wdaw/engine';
import { DAWState } from './types';

const STATE_KEY = 'daw-local-storage-state-v1';

export const deleteState = () =>
  localStorage.removeItem(STATE_KEY);

export const saveState = (state: DAWState) =>
  localStorage.setItem(STATE_KEY, JSON.stringify(state));

export const loadState = () => {
  const v = localStorage.getItem(STATE_KEY);
  return v ? (JSON.parse(v) as DAWState) : undefined;
};


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
