const NOTE = 8;

class Tempo {
  public BPM: number;
  private counter = 0;
  private subStep = 0;

  constructor(private sampleRate: number) {
    this.BPM = 130;
    this.adjust();
  }

  public setBPM = (beatsPerMinute: number): void => {
    this.BPM = beatsPerMinute;
    this.adjust();
  };

  private adjust() {
    this.subStep = 1 / ((60 * this.sampleRate) / (this.BPM * NOTE));
  }

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
