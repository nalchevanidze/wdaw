type WaveForm = {
  freq: Uint8Array;
  spec: Uint8Array;
  render: () => void;
};

class WaveFormImpl implements WaveForm {
  public freq: Uint8Array;
  public spec: Uint8Array;
  private analyser: AnalyserNode;

  constructor(context: AudioContext, audioSrc: MediaElementAudioSourceNode) {
    this.analyser = context.createAnalyser();
    audioSrc.connect(this.analyser);
    this.freq = new Uint8Array(200);
    this.spec = new Uint8Array(400);
  }

  render = (): void => {
    if (!this.analyser) return;
    this.analyser.getByteFrequencyData(this.spec);
    this.analyser.getByteTimeDomainData(this.freq);
  };
}

export type PlayingMode = 'paused' | 'play' | 'stop';

export type AudioState = {
  mode: PlayingMode;
  pro: number;
  time: number;
  freq: Uint8Array;
  spec: Uint8Array;
};

const defaultAudioState = {
  pro: 0,
  time: 0,
  mode: 'stop' as const,
  freq: new Uint8Array(40),
  spec: new Uint8Array(40)
};

export class AudioObject {
  private allowed = false;
  private mode: PlayingMode = 'stop';
  private setGain: (i: number) => void = () => {};
  private src: string = '';
  private waveForm: WaveForm = {
    freq: new Uint8Array(200),
    spec: new Uint8Array(400),
    render: () => undefined
  };

  private audio?: HTMLMediaElement;

  private allowAudioContext = (): void => {
    this.allowed = true;
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    const context: AudioContext = new AudioContext();
    const audioSrc = context.createMediaElementSource(this.audio);
    const gainObj = context.createGain();
    audioSrc.connect(gainObj);
    gainObj.connect(context.destination);

    this.setGain = (v: number) => gainObj.gain.setValueAtTime(v, 0);

    this.waveForm = new WaveFormImpl(context, audioSrc);
    this.setVolume(0.1);
  };

  public setSrc = (src: string) => {
    if (this.src !== src) {
      this.src = src;
      if (this.audio) {
        this.audio.src = src + '.mp3';
      }
    }
  };

  private loadSource = () =>
    new Promise((resolve) => {
      if (this.audio) {
        this.audio.src = this.src + '.mp3';
        this.audio.addEventListener('canplaythrough', resolve, true);
      }
    });

  private loadAudio = async () => {
    if (this.allowed) {
      return;
    }
    this.allowAudioContext();
    await this.loadSource();
  };

  private play = async () => {
    await this.loadAudio();
    this.mode = 'play';
    this.audio?.play();
  };

  private generateState = (): AudioState => {
    const { mode } = this;
    const time = this.audio?.currentTime ?? 0;
    const percent = time / (this.audio?.duration ?? 1);
    const pro = isNaN(percent) ? 0 : percent;
    return {
      time,
      pro,
      mode,
      freq: this.waveForm.freq,
      spec: this.waveForm.spec
    };
  };

  public playNew = (src: string): void => {
    this.setSrc(src);
    if (this.allowed) {
      this.play();
    }
  };

  public setVolume = (value: number): void => {
    if (this.allowed) {
      this.setGain(value);
    }
  };

  public playAt = async (pro: number): Promise<AudioState> => {
    await this.loadAudio();
    const time = this.audio ? this.audio.duration * pro : 1;
    if (this.audio) {
      this.audio.currentTime = time;
    }
    return {
      pro,
      time,
      mode: this.mode,
      freq: this.waveForm.freq,
      spec: this.waveForm.spec
    };
  };

  public getState = (): AudioState | undefined => {
    if (this.allowed) {
      if (this.mode === 'play') {
        this.waveForm.render();
      }
      return this.generateState();
    }
    return defaultAudioState;
  };

  private pause = (): void => {
    this.mode = 'paused';
    if (this.allowed && this.audio) {
      this.audio.pause();
    }
  };

  public stop = (): void => {
    this.mode = 'stop';
    if (this.allowed && this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  };

  public toggle = () => {
    this.mode == 'play' ? this.pause() : this.play();
  };
}
