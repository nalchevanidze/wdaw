import { MidiFragments, Preset, Presets } from '../common/types';
import { MidiRef, TracksState, TrackState } from '../state/state';
import { Synth } from '../synth';
import { Midi } from '../common/types';
import { Track } from './track';
import { toActions } from './utils/actions';

const getSize = (tracks: Track[]) => Math.max(...tracks.map((t) => t.size));

export class Tracks {
  private size: number = getSize(this.tracks);

  constructor(
    private tracks: Track[],
    private sampleRate: number
  ) {
    this.refresh();
  }

  public get = (i: number) => this.tracks[i];

  private createTracks(tracks: TrackState[], presets: Presets) {
    this.tracks = tracks.map(({ presetId, gain }) => {
      const track = new Track(new Synth(this.sampleRate), presets[presetId]);
      track.setGain(gain);
      return track;
    });
  }

  public set = ({ tracks, midiFragments, presets, midiRefs }: TracksState) => {
    this.createTracks(tracks, presets);
    this.setMidis(midiRefs, midiFragments);
  };

  public nextActions = (isPlaying: boolean, index: number) => {
    for (const track of this.tracks) {
      track.nextActions(isPlaying, index);
    }
  };

  private refresh() {
    this.size = Math.max(...this.tracks.map((t) => t.size));
  }

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

  public setGain = (i: number, gain: number) => {
    this.tracks[i].setGain(gain);
  };

  public setMidis = (midiRefs: MidiRef[], midiFragments: MidiFragments) => {
    this.tracks.forEach((track, id) => {
      track.setNoteLoops(
        toActions(
          midiRefs.filter(({ trackIndex }) => trackIndex === id),
          midiFragments
        )
      );
    });

    this.refresh();
  };

  public setPreset = (i: number, preset: Preset) =>
    this.get(i).setPreset(preset);
}

export { Track };
