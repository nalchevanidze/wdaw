export type Point = {
  x: number;
  y: number;
};

export type Circle = {
  center: Point;
  radius: number;
};

export type ArcSector = {
  start: number;
  end: number;
};

export type Annulus = {
  center: Point;
  radius: [number, number];
};

export type AnnulusSector = Annulus & {
  sector: ArcSector;
};
