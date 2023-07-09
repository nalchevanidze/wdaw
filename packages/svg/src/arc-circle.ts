import { Annulus, ArcSector, Circle, Point } from './types';

export const arcPoint = (
  { radius, center }: Circle,
  degree: number
): string => {
  const radian = (degree * Math.PI) / 180.0;
  const x = center.x + radius * Math.cos(radian);
  const y = center.y + radius * Math.sin(radian);
  return x.toFixed(2) + ' ' + y.toFixed(2);
};

export const arc = (
  circle: Circle,
  { start, end }: ArcSector,
  drawFromLeftToRight = true
): string => {
  const { radius } = circle;
  const startPoint = arcPoint(circle, start);
  const endPoint = arcPoint(circle, end);
  const cutMethod1 = Math.floor(Math.abs(end - start) / 180) % 2;
  const cutMethod2 = Number(start - end < 0);
  const cutoff = drawFromLeftToRight
    ? [cutMethod1, cutMethod2]
    : [1 - cutMethod1, 1 - cutMethod2];

  return `${startPoint} A${radius} ${radius} 0 ${cutoff.join(' ')} ${endPoint}`;
};

export const mod360 = (n: number) => (360 + n) % 360;

export const complementSector = ({ start, end }: ArcSector): ArcSector =>
  normalizeSector({ start: end, end: start });

export const inverseSector = ({ start, end }: ArcSector): ArcSector => ({
  start: -end,
  end: 360 - start
});

export const normalizeSector = ({
  start,
  end
}: {
  start: number;
  end: number;
}) => {
  const newStart = mod360(start);
  const newEnd = mod360(end);
  return { start: newStart, end: newEnd > newStart ? newEnd : newEnd + 360 };
};

export const subSectorByPercent = (
  pro: number,
  { start, end }: ArcSector,
  fromStart: boolean
): ArcSector => {
  const diff = end - start;
  const middleDegree = start + diff * pro;
  return fromStart
    ? { start: start, end: middleDegree }
    : { start: middleDegree, end: end };
};

// graphics
export const filledSector = (annulus: Annulus, sector: ArcSector): string => {
  const {
    center,
    radius: [r1, r2]
  } = annulus;
  const circle1 = { center, radius: r1 };
  const circle2 = { center, radius: r2 };
  const { start, end } = sector;
  const sectorBack = complementSector(sector);

  return `M ${sectorCutLine(annulus, start)} ${arc(
    circle1,
    sector
  )} L ${sectorCutLine(annulus, end)} ${arc(circle2, sectorBack, false)}`;
};

export const sectorCutLine = (
  { center, radius: [r1, r2] }: Annulus,
  degree: number
): string =>
  arcPoint({ center, radius: r1 }, degree) +
  ' ' +
  arcPoint({ center, radius: r2 }, degree);

export const radianToDegree = (radians: number): number =>
  (radians * 180) / Math.PI;

export const posToDegree = (center: Point, { x, y }: Point) =>
  360 - mod360(radianToDegree(Math.atan2(x - center.x, y - center.y)) - 90);

export const percentFromPoints = (
  point: Point,
  center: Point,
  { start, end }: ArcSector
): number => {
  const degree = posToDegree(center, point) - start;
  return (degree < 0 ? degree + 360 : degree) / (end - start);
};

const subtractPoints = ({ x, y }: Point, p: Point): Point => ({
  x: x - p.x,
  y: y - p.y
});

export const getDistance = (p1: Point, p2: Point): number => {
  const { x, y } = subtractPoints(p1, p2);
  return Math.sqrt(x ** 2 + y ** 2);
};
