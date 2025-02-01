import { Preset } from '../common/types';
import { TracksState } from '../state/state';
import { Synth } from '../synth';
import { Midi } from '../common/types';
import { Track } from './track';

export class Tracks {
  public current: Track;
  private size: number;

  constructor(private tracks: Track[]) {
    this.setTrack(0)
  }

  public setTrack = (n: number) => {
    this.current = this.tracks[n];
    this.refresh();
  };

  public set = ({ currentTrack, tracks }: TracksState) => {
    this.tracks = tracks.map((s) => {
      const track = new Track(new Synth());

      track.setMidi(s.midi);
      track.setPreset(s.preset);
      track.setGain(s.gain);

      return track;
    });

    this.setTrack(currentTrack)
  };

  public nextActions = (isPlaying: boolean, index: number) => {
    for (const track of this.tracks) {
      track.nextActions(isPlaying, index);
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

  public setGain = (i: number, gain: number)=> {
    this.tracks[i].setGain(gain)
  }

  public setMidi = (i: number, midi: Midi) => {
    this.tracks[i].setMidi(midi);
    this.refresh();
  };

  public setPreset = (preset: Preset) => this.current.setPreset(preset);
}

export { Track };
