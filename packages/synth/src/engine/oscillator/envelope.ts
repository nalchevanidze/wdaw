import { EnvelopeConfig } from './types';
import { counter } from './utils';

enum STAGE {
  ATTACK,
  DEACY,
  SUSTAIN,
  RELEASE
}

const toMilliseconds = (n: number) => Math.min((n * 3) ** 3, 200);

export class Envelope {
  private iter: IterableIterator<number>;
  private stage: STAGE = STAGE.ATTACK;
  private level = 0;
  private config: EnvelopeConfig = {
    attack: 0,
    decay: 0.4,
    sustain: 0,
    release: 0
  };
  live = false;

  public setup(state: EnvelopeConfig) {
    this.config = state;
  }

  next = (): number => {
    if (!this.live) return 0;

    switch (this.stage) {
      case STAGE.ATTACK: {
        const { value, done } = this.iter.next();
        if (done) {
          this.iter = counter(
            toMilliseconds(this.config.decay),
            value,
            this.config.sustain
          );
          this.stage = STAGE.DEACY;
          this.level = value;
        }
        return value;
      }
      case STAGE.DEACY: {
        const { value, done } = this.iter.next();
        this.level = value;
        if (done) {
          this.stage = STAGE.SUSTAIN;
        }
        return value;
      }
      case STAGE.SUSTAIN:
        return this.level;
      default:
        const release = this.iter.next();
        this.live = !release.done;
        return release.value;
    }
  };

  open = (): void => {
    this.live = true;
    this.stage = STAGE.ATTACK;
    this.iter = counter(toMilliseconds(this.config.attack), 0, 1);
  };

  close = (): void => {
    const time = toMilliseconds(this.config.release);
    this.iter = counter(time, this.level, 0);
    this.stage = STAGE.RELEASE;
  };

  kill = (): void => {
    this.live = false;
  };
}
