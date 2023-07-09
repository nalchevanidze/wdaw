import { radianToDegree, posToDegree } from '../arc-circle';

describe('#radianToDegree', () => {
  test('1 radian == 57,2958 Grad', () => {
    expect(radianToDegree(1)).toBeCloseTo(57.2958);
  });

  test('2 radian == 114,592 Grad', () => {
    expect(radianToDegree(2)).toBeCloseTo(114.592);
  });

  test('7 radian == 401,07 Grad', () => {
    expect(radianToDegree(7)).toBeCloseTo(401.07);
  });
});

describe('#posToDegree', () => {
  const point1 = { x: 1, y: 1 };

  test('degree of: point(1,1) point(2,2) is 45 dgree', () => {
    expect(posToDegree(point1, { x: 2, y: 2 })).toBeCloseTo(45);
  });

  test('degree of: point(1,1) point(1,2) is 90 dgree', () => {
    expect(posToDegree(point1, { x: 1, y: 2 })).toBeCloseTo(90);
  });

  test('degree of: point(1,1) point(0,2) is 135 dgree', () => {
    expect(posToDegree(point1, { x: 0, y: 2 })).toBeCloseTo(135);
  });

  test('degree of: point(1,1) point(0,1) is 180 dgree', () => {
    expect(posToDegree(point1, { x: 0, y: 1 })).toBeCloseTo(180);
  });

  test('degree of: point(1,1) point(0,0) is 225 dgree', () => {
    expect(posToDegree(point1, { x: 0, y: 0 })).toBeCloseTo(225);
  });

  test('degree of: point(1,1) point1(1,0) is 270 dgree', () => {
    expect(posToDegree(point1, { x: 1, y: 0 })).toBeCloseTo(270);
  });

  test('degree of: point(1,1) point(2,0) is 315 dgree', () => {
    expect(posToDegree(point1, { x: 2, y: 0 })).toBeCloseTo(315);
  });

  test('degree of: point(1,1) point(2,1) is 360 dgree', () => {
    expect(posToDegree(point1, { x: 2, y: 1 })).toBeCloseTo(360);
  });
});
