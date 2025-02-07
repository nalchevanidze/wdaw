import { Preset } from '../common/types';
import { Synth } from '../synth';
import { Midi, NoteAction } from '../common/types';
import { NoteLoop, NoteLoops, toActions } from './utils/actions';

class Track {
  // private actions: NoteAction[] = [];
  private preset: Preset;
  private gain: number = 1;
  private loops: NoteLoop[];
  public size = 0;

  public startNote = (n: number) => this.synth.startNote(this.preset, n);

  public endNote = (n: number) => this.synth.endNote(this.preset, n);

  constructor(private synth: Synth) {}

  public nextActions = (isPlaying: boolean, current: number) => {
    if (isPlaying && current > this.size) {
      this.clear();
      return;
    }

    for (const loop of this.loops) {
      const { start, end, size, offset, notes } = loop;
      if (start < current && current < end) {
        this.synth.nextActions(
          this.preset,
          isPlaying ? notes[(current - offset) % size] : undefined
        );
      }
    }
  };

  public setGain(n: number) {
    this.gain = n;
  }

  public next = () => this.synth.next(this.preset) * this.gain;

  public notes = () => this.synth.getNotes();

  public clear = () => this.synth.clear();

  public setNoteLoops = ({ loops, size }: NoteLoops): void => {
    this.loops = loops;
    this.size = size;
  };

  public setPreset = (preset: Preset) => {
    this.preset = preset;
  };
}

export { Track };
