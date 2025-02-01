import { NOTE } from '../common/defs';

class Tempo {
  public BPM: number;
  private sampleRate: number;
  private counter = 0;
  private subStep = 0;

  constructor(sampleRate: number) {
    this.BPM = 130;
    this.subStep = 1 / ((60 * sampleRate) / (this.BPM * NOTE));
    this.sampleRate = sampleRate;
  }

  public setBPM = (beatsPerMinute: number): void => {
    this.BPM = beatsPerMinute;
    this.subStep = 1 / ((60 * this.sampleRate) / (beatsPerMinute * NOTE));
  };

  public next(): boolean {
    this.counter += this.subStep;
    if (this.counter > 1) {
      //next step
      this.counter = 0;
      return true;
    }
    return false;
  }
}

export { Tempo };
