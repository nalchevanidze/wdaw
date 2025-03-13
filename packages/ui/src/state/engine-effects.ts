import { EngineState, SynthEngine } from '@wdaw/engine';
import { EngineAction } from './types';

export const engineEffects = (
  { tracks, midiFragments, presets, midiRefs }: EngineState,
  action: EngineAction,
  engine?: SynthEngine
): void => {
  if (!engine) return;
  switch (action.type) {
    // Player
    case 'PLAYER/SET_BPM':
      return engine.setBPM(action.payload);
    // Midi
    case 'MIDI/SET_MIDI_REF':
    case 'MIDI/SET_FRAGMENT':
    case 'MIDI/SET_MIDI_REFS':
      return engine.setMidis(midiRefs, midiFragments);
    // Track
    case 'TRACK/SET_TRACK':
      return action.payload.gain
        ? engine.setGain(action.id, action.payload.gain)
        : undefined;
    case 'TRACK/NEW_TRACK':
      engine.setTracks({ tracks, midiFragments, presets, midiRefs });
      return;
    // Preset
    case 'PRESET/SET_SEQUENCE':
    case 'PRESET/TOGGLE_MODULE':
    case 'PRESET/SET_ENVELOPE':
    case 'PRESET/SET_WAVE':
    case 'PRESET/SET_FILTER':
    case 'PRESET/ASSIGN_TO_TRACK':
      return engine.setPreset(action.trackId, presets[action.presetId]);
    // Store
    case 'STORE/LOAD':
      engine.setTracks(action.payload);
      engine.setBPM(action.payload.bpm);
      return;
  }
};
