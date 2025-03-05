import { Point } from '@wdaw/svg';

export type Matrix = {
  accuracyX(i: number): number;
  accuracyY(i: number): number;
  scaleY(i: number): number;
  scaleX(i: number): number;
  flipWithHeight?: number;
};

const setAccuracy = (ops: Matrix, { x, y }: Point): Point => ({
  x: ops.accuracyX(x),
  y: ops.accuracyY(y)
});

export const mapMove =
  (ops: Matrix, f: (moveX: number, moveY: number) => void) =>
  (moveX: number, moveY: number) =>
    f(ops.accuracyX(ops.scaleX(moveX)), ops.accuracyY(ops.scaleY(moveY)));

export const mapScale =
  (ops: Matrix, f: (moveX: number) => void) => (moveX: number) =>
    f(ops.accuracyX(ops.scaleX(moveX)));

export const mapAdd = (ops: Matrix, f: (p: Point) => void) => (p: Point) =>
  f(setAccuracy(ops, toPoint(ops, p)));

export const toPoint = (ops: Matrix, { x, y }: Point): Point => ({
  x: ops.scaleX(x),
  y: ops.flipWithHeight ? ops.flipWithHeight - ops.scaleY(y) : ops.scaleY(y)
});
