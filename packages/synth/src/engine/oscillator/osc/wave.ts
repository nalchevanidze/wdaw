import { WaveConfig } from '../types';
import { OSC } from './osc';

const squareFun = (i: number) => Number(i > 0.5) * 2 - 1;
const sawFun = (i: number) => 1 - i * 2;
const saw2Fun = (i: number) => 1 - ((i * 2) % 1) * 2;
const techFun = (i: number) =>
  i > 0.15 ? 0 : Math.min((0.05 - (i % 0.05)) * 50 - 0.7, 1);

const sineFun = (i: number) => Math.sin(i * Math.PI * 2);
const noiseFun = (): number => 1 - Math.random() * 2;

export const waveFunction = (
  phase: number,
  { square, saw, saw2, tech, sine, noise }: WaveConfig
) => {
  let mixin: number = 0;
  let i: number = 0;

  if (square) {
    mixin += square * squareFun(phase);
    i += square;
  }

  if (saw) {
    mixin += saw * sawFun(phase);
    i += saw;
  }

  if (saw2) {
    mixin += saw2 * saw2Fun(phase);
    i += saw2;
  }

  if (tech) {
    mixin += techFun(phase) * tech;
    i += tech;
  }

  if (sine) {
    mixin += sineFun(phase) * sine;
    i += sine;
  }

  if (noise > 0) {
    mixin += noise * noiseFun();
    i += noise;
  }

  if (i === 0) {
    return 0;
  }

  // mix
  return mixin / (i + 1);
};

export const renderOSCs = (
  wave: WaveConfig,
  oscList: OSC[],
  poly: number
): number => {
  let value: number = 0;

  for (let i: number = 0; i <= poly; i++) {
    value += waveFunction(oscList[i].next(), wave);
  }

  return value / (poly + 1);
};
