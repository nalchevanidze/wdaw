import { audioProcessor } from './audio-processor';
import { TypedEvents } from './common/events';
import { Time } from './common/time';
import { ChangeEvents } from './common/types';
import { MidiPlayer } from './player';
import { Tracks } from './player/tracks';
import { Resource, Resources } from './utils/debug';

const engines = new Resources('Engine', 3);

export class SynthEngine {
  private sampleRate = 44100;
  private events = new TypedEvents<ChangeEvents>();
  private time = new Time(this.events);
  private tracks = new Tracks(this.sampleRate, this.events, this.time);
  private player = new MidiPlayer(
    this.events,
    this.tracks,
    this.time,
    this.sampleRate
  );
  private closeContext: () => void;
  public resource: Resource;

  constructor() {
    this.resource = engines.new();
    this.closeContext = audioProcessor(this.player);
  }

  public addEventListener = this.events.addEventListener;

  public play = this.player.play;
  public pause = this.player.pause;
  public stop = this.player.stop;
  public setBPM = this.player.setBPM;
  public setTime = this.time.set;

  public setGain = this.tracks.setGain;
  public setMidis = this.tracks.setMidis;
  public setTracks = this.tracks.set;
  public setPreset = this.tracks.setPreset;
  public startNote = (i: number, n: number) => this.tracks.get(i).startNote(n);
  public endNote = (i: number, n: number) => this.tracks.get(i).endNote(n);

  public destroy = () => {
    this.resource.debug('destroy');
    this.events.clear();
    this.tracks.clear();
    this.closeContext();
  };
}
