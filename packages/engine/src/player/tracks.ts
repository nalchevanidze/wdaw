import { TypedEvents } from '../common/events';
import { ITime } from '../common/time';
import {
  MidiFragments,
  Preset,
  MidiRef,
  TracksInput,
  ChangeEvents
} from '../common/types';
import { Synth } from '../synth';
import { Track } from './track';
import { toActions } from './utils/actions';
import { Scalar } from './utils/dynamic-value';

export class Tracks {
  private tracks: Track[] = [];
  public size: number = 0;

  constructor(
    private sampleRate: number,
    private events: TypedEvents<ChangeEvents>,
    private time: ITime
  ) {}

  public get = (i: number) => this.tracks[i];

  public set = ({ tracks, midiFragments, presets, midiRefs }: TracksInput) => {
    this.tracks = tracks.map(({ presetId, gain }, i) => {
      const track =
        this.get(i) ??
        new Track(new Synth(this.sampleRate), (value) =>
          this.events.dispatch('changed/gain', { trackId: i, value })
        );

      track.setGain(gain).next(this.time.get());
      track.setPreset(presets[presetId]);
      return track;
    });

    this.setMidis(midiRefs, midiFragments);
  };

  public nextMidiActions = (index: number) => {
    for (const track of this.tracks) {
      track.nextMidiActions(index);
    }
  };

  public nextKeyboardActions = () => {
    for (const track of this.tracks) {
      track.nextKeyboardActions();
    }
  };

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

  public setGain = (i: number, gain: Scalar.Input) => {
    this.tracks[i].setGain(gain).next(this.time.get());
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

    this.size = Math.max(...this.tracks.map((t) => t.size));
  };

  public setPreset = (i: number, preset: Preset) =>
    this.get(i).setPreset(preset);
}

export { Track };
