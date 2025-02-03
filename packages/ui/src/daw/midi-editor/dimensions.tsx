import { Point, Area } from '@wdaw/svg';
import { Maybe } from '../types';

export type Dimentions = {
  noteHeight: number;
  canvasHeight: number;
};

const getPositionY = ({ canvasHeight, noteHeight }: Dimentions, y: number) =>
  Math.floor(1 + (canvasHeight - y) / noteHeight);

export const normalizer =
  (d: Dimentions) =>
  ({ x, y }: Point): Point => ({
    x: Math.floor(x),
    y: getPositionY(d, y)
  });

