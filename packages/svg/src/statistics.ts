import { arcPoint, arc, complementSector } from './arc-circle';
import { sectorCutLine } from './arc-circle';
import { Annulus, ArcSector, Circle } from './types';

const sectorStringMap = (
  data: Uint8Array,
  { start, end }: ArcSector,
  f: (value: number, degree: number) => string
): string => {
  const degreeScale = (end - start) / (data.length - 1);
  return (
    Array.from(data)
      .map((v, i) => f(v, start + i * degreeScale))
      .join('') + ' '
  );
};

export const sectorMap = <T>(
  values: number[],
  { start, end }: ArcSector,
  f: (value: number, degree: number) => T
): T[] => {
  const degreeScale = (end - start) / (values.length - 1);
  return values.map((v, i) => f(v, start + i * degreeScale));
};

export const roundFillStat = (
  data: Uint8Array,
  { center, radius: [r1, r2] }: Annulus,
  sector: ArcSector
): string =>
  'M ' +
  sectorStringMap(
    data,
    sector,
    (value, degree) =>
      ' ' +
      arcPoint(
        {
          center,
          radius: Math.max(r1, r1 + (value / 256) * (r2 - r1))
        },
        degree
      )
  ) +
  ' ' +
  arc({ center, radius: r1 }, complementSector(sector), false) +
  'Z';

export const roundStatStripes = (
  data: Uint8Array,
  { center, radius: [r1, r2] }: Annulus,
  sector: ArcSector
): string => {
  const scale = (r2 - r1) / 128;
  return sectorStringMap(
    data,
    sector,
    (value, degree) =>
      ' M ' +
      sectorCutLine({ center, radius: [r1, r1 + scale * value] }, degree)
  );
};

export const roundStatLineSector = (
  data: number[],
  { center, radius }: Circle,
  direction: number,
  sector: ArcSector
): string[] =>
  sectorMap<string>(data, sector, (value, degree) =>
    arcPoint({ center, radius: radius + value * direction }, degree)
  );
