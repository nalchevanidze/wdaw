import { Envelope as EnvelopeInput } from '../../common/types';
import { WaveNode } from './types';
import { counter } from './utils';

enum STAGE {
  ATTACK,
  DEACY,
  SUSTAIN,
  RELEASE
}

const toMilliseconds = (n: number) => Math.min((n * 3) ** 3, 200);

export class Envelope implements WaveNode<EnvelopeInput> {
  private iter?: IterableIterator<number>;
  private stage: STAGE = STAGE.ATTACK;
  private level = 0;

  live = false;

  next = (env: EnvelopeInput): number => {
    if (!this.live || !this.iter) return 0;

    switch (this.stage) {
      case STAGE.ATTACK: {
        const { value, done } = this.iter.next();
        if (done) {
          this.iter = counter(toMilliseconds(env.decay), value, env.sustain);
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
      default: {
        const release = this.iter.next();
        this.live = !release.done;
        return release.value;
      }
    }
  };

  open = (env: EnvelopeInput): void => {
    this.live = true;
    this.stage = STAGE.ATTACK;
    this.iter = counter(toMilliseconds(env.attack), 0, 1);
  };

  close = (env: EnvelopeInput): void => {
    const time = toMilliseconds(env.release);
    this.iter = counter(time, this.level, 0);
    this.stage = STAGE.RELEASE;
  };

  kill = (): void => {
    this.live = false;
  };
}
