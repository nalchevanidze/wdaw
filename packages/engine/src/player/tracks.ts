import { MidiCallback, MidiFragments, Preset, Presets } from '../common/types';
import { TracksState } from '../state/state';
import { Synth } from '../synth';
import { Midi } from '../common/types';
import { Track } from './track';
import { toActions } from './utils/actions';

const getSize = (tracks: Track[]) => Math.max(...tracks.map((t) => t.size));

export class Tracks {
  private size: number = getSize(this.tracks);

  onChange: MidiCallback = () => {
    console.warn('default onChange handler call');
  };

  constructor(
    private tracks: Track[],
    private sampleRate: number
  ) {
    this.refresh();
  }

  public get = (i: number) => this.tracks[i];

  public set = (
    { currentTrack, tracks }: TracksState,
    midiFragments: MidiFragments,
    presets: Presets
  ) => {
    this.tracks = tracks.map(({ midi, presetId, gain }, id) => {
      const track = new Track(
        new Synth(this.sampleRate, (notes: number[]) =>
          this.onChange({ type: 'NOTES', notes, id })
        ),
        presets[presetId]
      );

      track.setNoteLoops(toActions(midi, midiFragments));
      track.setGain(gain);

      return track;
    });

    this.refresh();
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

  public setMidi = (i: number, midis: Midi[], fragments: MidiFragments) => {
    const noteLoops = toActions(midis, fragments);
    this.tracks[i].setNoteLoops(noteLoops);
    this.refresh();
  };

  public setPreset = (i: number, preset: Preset) =>
    this.get(i).setPreset(preset);
}

export { Track };
