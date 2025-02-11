import { Preset } from '../common/types';
import { Synth } from '../synth';
import { RecordLoop } from './record';
import { NoteLoops } from './utils/actions';

class Track {
  private loops: RecordLoop[] = [];
  private preset: Preset;
  private gain: number = 1;
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
      const inRange = loop.start <= current && current <= loop.end;

      if (inRange || !isPlaying) {
        this.synth.nextActions(
          this.preset,
          isPlaying ? loop.get(current) : undefined
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
