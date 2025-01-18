import { Preset } from '../common/types';
import { TracksState } from '../state/state';
import { Synth } from '../synth';
import { Midi } from '../types';
import { Track } from './track';

export class Tracks {
  public current: Track;
  private size: number;

  constructor(private tracks: Track[]) {
    this.current = tracks[0];
    this.refresh();
  }

  public set = ({ currentTrack, tracks }: TracksState) => {
    this.tracks = tracks.map((s) => {
      const track = new Track(new Synth());

      track.setMidi(s.midi);
      track.setPreset(s.preset);
      track.setGain(s.gain)

      return track;
    });
    this.current = this.tracks[currentTrack];
    this.refresh();
  };

  public nextActions = (isPlaying: boolean, current: number) => {
    for (const track of this.tracks) {
      track.nextActions(isPlaying, current);
    }
  };

  private refresh() {
    this.size = Math.max(...this.tracks.map((t) => t.size()));
  }

  public next = () => {
    let result = 0;
    for (const track of this.tracks) {
      result += track.next();
    }
    return result;
  };

  public notes = () => this.current.notes();

  public clear = () => {
    for (const track of this.tracks) {
      track.clear();
    }
  };

  public isDone = (current: number) => current >= this.size;

  public setMidi = (midi: Midi) => {
    this.current.setMidi(midi);
    this.refresh();
  };

  public setPreset = (preset: Preset) => this.current.setPreset(preset);
}

export { Track };
