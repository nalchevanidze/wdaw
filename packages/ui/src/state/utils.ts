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

export const mapLib = <T>(
  lib: Record<string, T>,
  id: number,
  f: (a: T) => Partial<T>
): Record<string, T> => ({ ...lib, [id]: { ...lib[id], ...f(lib[id]) } });

export const mapMidiFragment = (
  midiFragments: EngineState['midiFragments'],
  id: string,
  f: (a: MidiFragment) => Partial<MidiFragment>
) => ({
  midiFragments: {
    ...midiFragments,
    [id]: { ...midiFragments[id], ...f(midiFragments[id]) }
  }
});

export const mapTrack = (
  tracks: EngineState['tracks'],
  id: number,
  f: (a: TrackInput) => Partial<TrackInput>
): Partial<EngineState> => ({
  tracks: tracks.map((t, i) => (id === i ? { ...t, ...f(t) } : t))
});

export const mapPreset = (
  presets: EngineState['presets'],
  id: string,
  f: (a: Preset) => Partial<Preset>
) => ({
  presets: { ...presets, [id]: { ...presets[id], ...f(presets[id]) } }
});

export const mapMidiRefs = (
  midiRefs: EngineState['midiRefs'],
  id: string,
  f: (a: MidiRef) => Partial<MidiRef>
) => ({
  midiRefs: midiRefs.map((m) => (m.id === id ? { ...m, ...f(m) } : m))
});
