import { audioProcessor } from './audio-processor';
import { EventHandler, EventName, mapHandler } from './common/events';
import { Midi, PLAYER_ACTION } from './common/types';
import { MidiPlayer } from './player';
import { Tracks } from './player/tracks';
import { TracksState } from './state/state';

export class SynthEngine {
  private sampleRate = 44100;
  private tracks = new Tracks([], this.sampleRate);
  private player = new MidiPlayer(this.tracks, this.sampleRate);
  private closeContext: () => void;
  private target = this.player.target;

  constructor() {
    this.closeContext = audioProcessor(this.player);
  }

  public addEventListener = <N extends EventName>(
    name: N,
    f: EventHandler<N>
  ) => this.target.addEventListener(name, mapHandler(name, f));

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
    this.tracks.clear();
    this.closeContext();
  }

  public setTime = (t: number) => this.player.setTime(t);
}
