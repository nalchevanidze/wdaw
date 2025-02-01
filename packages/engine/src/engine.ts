import { audioProcessor, SoundIterator } from './audio-processor';
import { Midi, PLAYER_ACTION } from './common/types';
import { MidiCallback, MidiPlayer } from './player';
import { Tracks } from './player/tracks';
import { TracksState } from './state/state';

export class SynthEngine implements SoundIterator {
  private tracks = new Tracks([]);
  private player = new MidiPlayer(this.tracks);

  private closeContext: () => void;

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  public setMidiCallback(f: MidiCallback) {
    this.player.onChange = f;
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

  public setTrack = this.tracks.setTrack;

  public setGain = this.tracks.setGain;

  public startNote(n: number) {
    this.tracks.current.startNote(n);
    this.player.refresh();
  }

  public endNote(n: number) {
    this.tracks.current.endNote(n);
    this.player.refresh();
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
