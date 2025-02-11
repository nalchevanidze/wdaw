import { MidiFragments, Preset, Presets } from '../common/types';
import { TracksState } from '../state/state';
import { Synth } from '../synth';
import { Midi } from '../common/types';
import { Track } from './track';
import { toActions } from './utils/actions';

export class Tracks {
  private current: Track;
  private size: number;

  constructor(
    private tracks: Track[],
    private sampleRate: number
  ) {
    this.setTrack(0);
  }

  public get = (i: number) => this.tracks[i];

  public setTrack = (n: number) => {
    this.current = this.tracks[n];
    this.refresh();
  };

  public set = (
    { currentTrack, tracks }: TracksState,
    midiFragments: MidiFragments,
    presets: Presets
  ) => {
    this.tracks = tracks.map(({ midi, presetId, gain }) => {
      const track = new Track(new Synth(this.sampleRate));

      track.setNoteLoops(toActions(midi, midiFragments));
      track.setPreset(presets[presetId]);
      track.setGain(gain);

      return track;
    });

    this.setTrack(currentTrack);
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

  public notes = () => this.current.notes();

  public clear = () => {
    for (const track of this.tracks) {
      track.clear();
    }
  };

  public isDone = (current: number) => current >= this.size;

  public setGain = (i: number, gain: number) => {
    this.tracks[i].setGain(gain);
  };

  public setMidi = (i: number, midis: Midi[], fragments: MidiFragments) => {
    const noteLoops = toActions(midis, fragments);
    this.tracks[i].setNoteLoops(noteLoops);
    this.refresh();
  };

  public setPreset = (i: number, preset: Preset) =>
    this.get(i).setPreset(preset);
}

export { Track };
