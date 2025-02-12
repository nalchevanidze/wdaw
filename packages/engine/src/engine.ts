import { audioProcessor, SoundIterator } from './audio-processor';
import {
  EngineUpdate,
  Midi,
  MidiCallback,
  PLAYER_ACTION
} from './common/types';
import { MidiPlayer } from './player';
import { EventName, EventTypes, parseEvent } from './player/player';
import { Tracks } from './player/tracks';
import { TracksState } from './state/state';

export class SynthEngine implements SoundIterator {
  private sampleRate = 44100;
  private tracks = new Tracks([], this.sampleRate);
  private player = new MidiPlayer(this.tracks, this.sampleRate);
  private closeContext: () => void;
  private events = this.player.target;

  public addEventListener = <T extends EventName>(
    name: T,
    f: (e: EventTypes[T]) => void
  ) =>
    this.events.addEventListener(name, (e: Event) => {
      const value = parseEvent(name, e);
      if (value === undefined) return;
      requestAnimationFrame(() => f(value));
    });

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  public setMidi = this.tracks.setMidi;

  public setPlay(mode: PLAYER_ACTION) {
    switch (mode) {
      case 'play':
        return this.player.play();
      case 'pause':
        return this.player.pause();
      case 'stop':
        return this.player.stop();
    }
  }

  public setBPM = this.player.setBPM;

  public setGain = this.tracks.setGain;

  public startNote(i: number, n: number) {
    this.tracks.get(i).startNote(n);
  }

  public endNote(i: number, n: number) {
    this.tracks.get(i).endNote(n);
  }

  public setPreset = this.tracks.setPreset;

  public setTracks = this.tracks.set;

  public destroy() {
    this.player.setTime(0);
    this.tracks.clear();
    this.closeContext();
  }

  public setTime = (t: number) => this.player.setTime(t);

  public next = this.player.next;
}
