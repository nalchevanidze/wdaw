import * as React from 'react';
import { WaveGrid } from './wave-grid';
import { waveFunction } from '@wdaw/engine';
import { WaveConfig } from '@wdaw/engine/src/common/types';
import { usePreset } from '../daw/hooks/use-preset';

const range = <T extends unknown>(length: number, f: (i: number) => T): T[] =>
  Array.from({ length }, (_, i) => f(i));

const point = (w: WaveConfig, i: number) =>
  1 - waveFunction((i + w.offset) % 1, w);

const genPath = (wave: WaveConfig, size: number) => {
  const scaleY = size / 2;

  const wavePoint = (i: number) => point(wave, i) * scaleY;

  const center = (wavePoint(1) + wavePoint(0)) / 2;
  const items = range(size, (i) => [i, wavePoint(i / size)]).flat();
  const path = [0, center, items, size, center].flat().map((p) => p.toFixed(1));

  return `M ${path.join(' ')}`;
};

type Props = {
  quality: number;
};
export const WaveForm: React.FC<Props> = ({ quality }) => {
  const { wave } = usePreset();

  return (
    <svg
      viewBox={[0, 0, quality, quality].join(' ')}
      width="80px"
      height="80px"
    >
      <path
        d={genPath(wave, quality)}
        stroke="#444"
        strokeWidth={2}
        fill="none"
      />
      <WaveGrid color="gray" />
    </svg>
  );
};
