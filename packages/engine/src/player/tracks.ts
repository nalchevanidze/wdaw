import {
  MidiFragments,
  Preset,
  Presets,
  MidiRef,
  TrackInput,
  TracksInput
} from '../common/types';
import { Synth } from '../synth';
import { Track } from './track';
import { toActions } from './utils/actions';

const getSize = (tracks: Track[]) => Math.max(...tracks.map((t) => t.size));

export class Tracks {
  private size: number = getSize(this.tracks);

  constructor(
    private tracks: Track[],
    private sampleRate: number
  ) {
    this.refresh();
  }

  public get = (i: number) => this.tracks[i];

  private setupTracks(tracks: TrackInput[], presets: Presets) {
    this.tracks = tracks.map(({ presetId, gain }, i) => {

      const track = this.get(i) ?? new Track(new Synth(this.sampleRate));

      track.setGain(gain);
      track.setPreset(presets[presetId]);
      return track;
    });
  }

  public set = ({ tracks, midiFragments, presets, midiRefs }: TracksInput) => {
    this.setupTracks(tracks, presets);
    this.setMidis(midiRefs, midiFragments);
  };

  public nextActions = (isPlaying: boolean, index: number) => {
    for (const track of this.tracks) {
      track.nextActions(isPlaying, index);
    }
  };

  private refresh() {
    this.size = Math.max(...this.tracks.map((t) => t.size));
  }

  public next = () => {
    let result = 0;
    for (const track of this.tracks) {
      result += track.next();
    }
    return result;
  };

  public clear = () => {
    for (const track of this.tracks) {
      track.clear();
    }
  };

  public isDone = (time: number) => time >= this.size;

  public setGain = (i: number, gain: number) => {
    this.tracks[i].setGain(gain);
  };

  public setMidis = (midiRefs: MidiRef[], midiFragments: MidiFragments) => {
    this.tracks.forEach((track, id) => {
      track.setNoteLoops(
        toActions(
          midiRefs.filter(({ trackId }) => trackId === id),
          midiFragments
        )
      );
    });

    this.refresh();
  };

  public setPreset = (i: number, preset: Preset) =>
    this.get(i).setPreset(preset);
}

export { Track };
