import { audioProcessor } from './audio-processor';
import { EventHandler, EventName, makeHandler } from './common/events';
import { Midi } from './common/types';
import { MidiPlayer } from './player';
import { Tracks } from './player/tracks';
import { TracksState } from './state/state';

export class SynthEngine {
  private sampleRate = 44100;
  private events = new EventTarget();
  private tracks = new Tracks([], this.sampleRate);
  private player = new MidiPlayer(this.events, this.tracks, this.sampleRate);
  private closeContext: () => void;

  constructor() {
    this.closeContext = audioProcessor(this.player);
  }

  public addEventListener = <N extends EventName>(
    name: N,
    f: EventHandler<N>
  ) => this.events.addEventListener(name, makeHandler(name, f));

  public play = this.player.play;
  public pause = this.player.pause;
  public stop = this.player.stop;
  public setBPM = this.player.setBPM;
  public setTime = this.player.setTime;
  
  public setGain = this.tracks.setGain;
  public setMidi = this.tracks.setMidi;
  public setTracks = this.tracks.set;
  public setPreset = this.tracks.setPreset;
  public startNote = (i: number, n: number) => this.tracks.get(i).startNote(n);
  public endNote = (i: number, n: number) => this.tracks.get(i).endNote(n);

  public destroy() {
    this.tracks.clear();
    this.closeContext();
  }
}
