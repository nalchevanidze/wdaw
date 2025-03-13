import { audioProcessor } from './audio-processor';
import { EngineEvents } from './common/events';
import { MidiPlayer } from './player';
import { Tracks } from './player/tracks';
import { debug, Resource } from './utils/debug';

const resource = new Resource('engine', 3);

export class SynthEngine {
  private sampleRate = 44100;
  private events = new EngineEvents();
  private tracks = new Tracks(this.sampleRate);
  private player = new MidiPlayer(this.events, this.tracks, this.sampleRate);
  private closeContext: () => void;
  public id: string;

  constructor() {
    this.id = resource.new();
    this.closeContext = audioProcessor(this.player);
  }

  public addEventListener = this.events.addEventListener;

  public play = this.player.play;
  public pause = this.player.pause;
  public stop = this.player.stop;
  public setBPM = this.player.setBPM;
  public setTime = this.player.setTime;

  public setGain = this.tracks.setGain;
  public setMidis = this.tracks.setMidis;
  public setTracks = this.tracks.set;
  public setPreset = this.tracks.setPreset;
  public startNote = (i: number, n: number) => this.tracks.get(i).startNote(n);
  public endNote = (i: number, n: number) => this.tracks.get(i).endNote(n);

  public destroy = () => {
    debug('destroy', this.id);
    this.tracks.clear();
    this.closeContext();
  };
}
