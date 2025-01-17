import { audioProcessor, SoundIterator } from './audio-processor';
import { Midi, PLAYER_ACTION } from './types';
import { Synth } from './synth';
import { MidiCallback, MidiPlayer, Track } from './player';
import { Preset } from './common/types';

export class SynthEngine implements SoundIterator {
  private synth = new Synth();
  private track = new Track(this.synth);
  private player = new MidiPlayer(this.track);

  private preset: Preset;
  private closeContext: () => void;

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  public setMidiCallback(f: MidiCallback) {
    this.player.onChange = f;
  }

  public setMidi = this.track.setMidi;

  public setPreset(preset: Preset) {
    this.preset = preset;
  }

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

  public startNote(n: number) {
    this.synth.startNote(this.preset, n);
    this.player.refresh();
  }

  public endNote(n: number) {
    this.synth.endNote(this.preset, n);
    this.player.refresh();
  }

  public destroy() {
    this.player.setTime(0);
    this.synth.clear();
    this.closeContext();
  }

  public setTime = (t: number) => this.player.setTime(t);

  public next() {
    this.player.refresh();
    return this.synth.next(this.preset, this.player.next());
  }
}
