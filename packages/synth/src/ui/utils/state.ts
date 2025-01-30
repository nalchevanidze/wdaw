import { DAWState } from '../../engine/state';
import { NamedPreset, TrackState } from '../../engine/state/state';

const mapCurrentTrack = (state: DAWState, f: (a: TrackState) => TrackState) =>
  mapTrack(state.tracks.currentTrack, state, f);

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

export const mapPreset = (
  state: DAWState,
  f: (a: NamedPreset) => Partial<NamedPreset>
) =>
  mapCurrentTrack(state, ({ preset, ...rest }) => ({
    ...rest,
    preset: { ...preset, ...f(preset) }
  }));
