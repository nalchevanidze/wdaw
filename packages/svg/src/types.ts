export type Point = {
  readonly x: number;
  readonly y: number;
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

export type Trajectory = readonly [Point, Point];
