import { arcPoint, arc, complementSector } from "./arc-circle";
import { sectorCutLine } from "./arc-circle";
import { Annulus, ArcSector, Circle } from "./types";

const sectorStringMap = (
  data: Uint8Array,
  { start, end }: ArcSector,
  handler: (value: number, degree: number) => string
): string => {
  const length = data.length;
  let output = "";
  const spreadAngle = end - start;
  const degreeScale = spreadAngle / (length - 1);
  for (let i = 0; i < length; i++) {
    output += handler(data[i], start + i * degreeScale);
  }
  return output + " ";
};

export const sectorMap = <T>(
  data: number[],
  { start, end }: ArcSector,
  handler: (value: number, degree: number) => T
): T[] => {
  const length = data.length;
  const spreadAngle = end - start;
  const degreeScale = spreadAngle / (length - 1);
  const output: T[] = [];
  for (let i = 0; i < length; i++) {
    output.push(handler(data[i], start + i * degreeScale));
  }
  return output;
};

export const roundFillStat = (
  data: Uint8Array,
  { center, radius: [r1, r2] }: Annulus,
  sector: ArcSector
): string =>
  "M " +
  sectorStringMap(
    data,
    sector,
    (value, degree) =>
      " " +
      arcPoint(
        {
          center,
          radius: Math.max(r1, r1 + (value / 256) * (r2 - r1)),
        },
        degree
      )
  ) +
  " " +
  arc({ center, radius: r1 }, complementSector(sector), false) +
  "Z";

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
      " M " +
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
