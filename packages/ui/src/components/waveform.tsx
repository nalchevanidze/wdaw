import * as React from 'react';
import { WaveGrid } from './wave-grid';
import { waveFunction } from '@wdaw/engine';
import { WaveConfig } from '@wdaw/engine/src/common/types';
import { usePreset } from '../daw/hooks/use-preset';

const genPath = (wave: WaveConfig, width: number) => {
  const wavePoint = (index: number) =>
    (1 - waveFunction((index + wave.offset) % 1, wave)) * (width / 2);

  const middlePoint = (wavePoint(1) + wavePoint(0)) / 2;

  const waveList = Array.from(
    { length: width },
    (_, i) => i + ' ' + wavePoint(i / width)
  );

  return 'M 0 ' + middlePoint + ' ' + waveList + ` ${width}` + middlePoint;
};

export const WaveForm: React.FC = () => {
  const [{ wave }] = usePreset();

  const size = 200;

  return (
    <svg viewBox={[size, 0, size, size].join(' ')} width="90px" height="90px">
      <path d={genPath(wave, size)} stroke="#444" strokeWidth={2} fill="none" />
      <WaveGrid color="gray" />
    </svg>
  );
};
