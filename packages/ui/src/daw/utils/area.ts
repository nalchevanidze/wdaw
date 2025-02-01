import { Area } from '../types';

export const distanceX = ([start, current]: Area, step: number, scale: number = 1) =>
  Math.round((current.x - (start?.x ?? 0)) / (step * scale)) * step;

export const distanceY = ([start, current]: Area, factor: number) =>
  Math.round((current.y - (start?.y ?? 0)) / factor);
