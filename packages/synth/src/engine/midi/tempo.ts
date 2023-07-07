let counter: number = 0;
let subStep = 0;

class Tempo {
  public BPM: number;
  private sampleRate: number;

  public setBMP = (beatsPerMinute: number): void => {
    this.BPM = beatsPerMinute;
    subStep = 1 / ((60 * this.sampleRate) / (beatsPerMinute * 8));
  };

  constructor(sampleRate: number) {
    this.BPM = 130;
    subStep = 1 / ((60 * sampleRate) / (this.BPM * 8));
    this.sampleRate = sampleRate;
  }

  next(): boolean {
    counter += subStep;
    if (counter > 1) {
      //next step
      counter = 0;
      return true;
    }
    return false;
  }
}

export { Tempo };
