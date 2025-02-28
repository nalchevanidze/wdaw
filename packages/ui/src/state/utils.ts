import { TrackInput, Preset, MidiFragment } from '@wdaw/engine';
import { State } from './types';

const STATE_KEY = 'daw-local-storage-state-v1';

export const deleteState = () => localStorage.removeItem(STATE_KEY);

export const saveState = (state: State): undefined => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
};

export const loadState = () => {
  const v = localStorage.getItem(STATE_KEY);
  return v ? (JSON.parse(v) as State) : undefined;
};

export const setMidiFragment = (
  id: string,
  { midiFragments }: State,
  fields: Partial<MidiFragment>
) => ({
  midiFragments: {
    ...midiFragments,
    [id]: { ...midiFragments[id], ...fields }
  }
});

export const mapTracks = (
  { tracks }: State,
  f: (a: TrackInput, i: number) => Partial<TrackInput>
): Partial<State> => ({
  tracks: tracks.map((t, i) => ({ ...t, ...f(t, i) }))
});

export const mapTrack = (
  id: number,
  { tracks }: State,
  f: (a: TrackInput) => Partial<TrackInput>
): Partial<State> => ({
  tracks: tracks.map((t, i) => (id === i ? { ...t, ...f(t) } : t))
});

export const mapPreset = (
  { presets }: State,
  id: string,
  f: (a: Preset) => Partial<Preset>
) => ({
  presets: { ...presets, [id]: { ...presets[id], ...f(presets[id]) } }
});
