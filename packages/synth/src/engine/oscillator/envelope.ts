import { EnvelopeConfig } from '../../core/types';
import { WaveNode } from './types';
import { counter } from './utils';

enum STAGE {
  ATTACK,
  DEACY,
  SUSTAIN,
  RELEASE
}

const toMilliseconds = (n: number) => Math.min((n * 3) ** 3, 200);

export class Envelope implements WaveNode<EnvelopeConfig> {
  private iter: IterableIterator<number>;
  private stage: STAGE = STAGE.ATTACK;
  private level = 0;

  live = false;


  next = (env: EnvelopeConfig): number => {
    if (!this.live) return 0;

    switch (this.stage) {
      case STAGE.ATTACK: {
        const { value, done } = this.iter.next();
        if (done) {
          this.iter = counter(
            toMilliseconds(env.decay),
            value,
            env.sustain
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
      default: {
        const release = this.iter.next();
        this.live = !release.done;
        return release.value;
      }
    }
  };

  open = (wave: EnvelopeConfig): void => {
    this.live = true;
    this.stage = STAGE.ATTACK;
    this.iter = counter(toMilliseconds(wave.attack), 0, 1);
  };

  close = (wave: EnvelopeConfig): void => {
    const time = toMilliseconds(wave.release);
    this.iter = counter(time, this.level, 0);
    this.stage = STAGE.RELEASE;
  };

  kill = (): void => {
    this.live = false;
  };
}
