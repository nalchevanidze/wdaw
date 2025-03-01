import {
  TrackInput,
  Preset,
  MidiFragment,
  EngineState,
  MidiRef
} from '@wdaw/engine';
import { State } from './types';

const STATE_KEY = 'daw-local-storage-state-v1';

export const deleteState = () => localStorage.removeItem(STATE_KEY);

export const saveState = (state: EngineState): undefined => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
};

export const loadState = () => {
  const v = localStorage.getItem(STATE_KEY);
  return v ? (JSON.parse(v) as State) : undefined;
};

type Lib<T> = Record<string, T>;

type Fun<T> = (a: T) => Partial<T>;

const mapLib = <T>(lib: Lib<T>, id: string, f: Fun<T>): Lib<T> => ({
  ...lib,
  [id]: { ...lib[id], ...f(lib[id]) }
});

export const mapMidiFragment = (
  midiFragments: EngineState['midiFragments'],
  id: string,
  f: Fun<MidiFragment>
) => ({ midiFragments: mapLib(midiFragments, id, f) });

export const mapPreset = (
  presets: EngineState['presets'],
  id: string,
  f: Fun<Preset>
) => ({ presets: mapLib(presets, id, f) });

export const mapTrack = (
  tracks: EngineState['tracks'],
  id: number,
  f: Fun<TrackInput>
): Partial<EngineState> => ({
  tracks: tracks.map((t, i) => (id === i ? { ...t, ...f(t) } : t))
});

export const mapMidiRefs = (
  midiRefs: EngineState['midiRefs'],
  id: string,
  f: Fun<MidiRef>
) => ({
  midiRefs: midiRefs.map((m) => (m.id === id ? { ...m, ...f(m) } : m))
});
