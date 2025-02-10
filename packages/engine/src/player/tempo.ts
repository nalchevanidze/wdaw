const BEAT_SIZE = 8;
const SECOND = 60;

class Tempo {
  public BPM: number;
  private counter = 0;
  private subStep = 0;
  public size = 1

  constructor(private sampleRate: number) {
    this.BPM = 130;
    this.adjust();
  }

  public setBPM = (beatsPerMinute: number): void => {
    this.BPM = beatsPerMinute;
    this.adjust();
  };

  private adjust() {
    const totalSteps = (SECOND * this.sampleRate) / (this.BPM * BEAT_SIZE);
    this.subStep = 1 / totalSteps;
  }

  public next(): boolean {
    this.counter += this.subStep;
    if (this.counter > this.size) {
      //next step
      this.counter = 0;
      return true;
    }
    return false;
  }
}

export { Tempo };
