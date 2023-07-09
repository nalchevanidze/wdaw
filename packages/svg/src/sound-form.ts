import { roundStatLineSector } from './statistics';
import { AnnulusSector } from './types';

export default function resampleData(data: number[], steps: number) {
  const out = [];
  const d = Math.floor(data.length / steps);
  let n = 0;
  let v = 0;
  for (let i = 0; i < data.length; i++) {
    n++;
    if (n > d) {
      out.push(Math.round((v / d) * 100) / 100);
      n = 0;
      v = 0;
    } else {
      v += Math.abs(data[i]);
    }
  }
  return out;
}

export const circleFill = (
  data: number[],
  { center, radius: [r1, r2], sector }: AnnulusSector
): string => {
  if (data.length < 2) {
    return '';
  }
  const height = (r2 - r1) * 0.9;
  const newCircle = { center, radius: (r2 + r1) / 2 };
  const waveFormInside = roundStatLineSector(data, newCircle, -height, sector)
    .reverse()
    .join(' ');
  const waveFormOutside = roundStatLineSector(
    data,
    newCircle,
    height,
    sector
  ).join(' ');
  return `M ${waveFormInside}  ${waveFormOutside}z`;
};

export const flatStripes = (
  data: number[],
  props: { resolution: number; height: number; width: number }
): string => {
  if (data.length < 2) {
    return '';
  }

  const { width, height, resolution } = props;
  const resampledData = resampleData(data, resolution);
  const stepSize = width / resolution;

  return resampledData
    .map(
      (value, index) =>
        ` M${index * stepSize} ${value * height} ${index * stepSize} -${
          value * height
        } `
    )
    .join(' ');
};
