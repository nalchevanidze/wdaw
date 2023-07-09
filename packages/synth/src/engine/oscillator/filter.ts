import { FilterConfig } from './types';

/* 
according:
	http://www.musicdsp.org/showArchiveComment.php?ArchiveID=26
	https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
*/
class MoogFilter {
  private state: FilterConfig = {
    cutoff: 0,
    enabled: false,
    envelope: 0,
    resonance: 0
  };
  private frequency = 0;
  private diff = 0;
  private input: Float32Array = new Float32Array(5).fill(0);
  private output: Float32Array = new Float32Array(5).fill(0);

  setup = (state: FilterConfig) => {
    this.state = state;
  };

  pole = (index: number): number =>
    0.3 * this.input[index] + this.diff * this.output[index];

  private compute = (
    inputSample: number,
    inputFrequency: number,
    resonance: number
  ): number => {
    const power = inputFrequency ** 2;
    this.diff = 1 - inputFrequency;
    this.frequency = resonance * 4 * (1.0 - 0.15 * power);
    inputSample -= this.output[4] * this.frequency;
    this.output[0] = inputSample * (0.35013 * power ** 2);
    for (let i = 0; i < 5; i++) {
      const i2 = i + 1;
      this.output[i2] = this.output[i] + this.pole(i2);
      this.input[i2] = this.output[i];
    }
    return this.output[4];
  };

  next(input: number, envCutoff: number) {
    const { enabled, cutoff, envelope, resonance } = this.state;
    if (!enabled) return input;
    const combinedCutoff = cutoff + envCutoff * envelope;

    return this.compute(
      input,
      Math.min(1, Math.max(combinedCutoff, 0.002)),
      resonance
    );
  }
}

export { MoogFilter };
