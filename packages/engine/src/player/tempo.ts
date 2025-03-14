const BEAT_SIZE = 8;
const SECOND = 60;

class Tempo {
  private bpm: number;
  private counter = 0;
  private subStep = 0;
  private size = 1;

  constructor(private sampleRate: number) {
    this.bpm = 130;
    this.adjust();
  }

  public setBPM = (beatsPerMinute: number): void => {
    this.bpm = beatsPerMinute;
    this.adjust();
  };

  public next(): number {
    this.counter += this.subStep;
    if (this.counter > this.size) {
      //next step
      this.counter = 0;
      return this.size;
    }
    return 0;
  }

  private adjust() {
    const totalSteps = (SECOND * this.sampleRate) / (this.bpm * BEAT_SIZE);
    this.subStep = 1 / totalSteps;
  }
}

export { Tempo };
