import { counter } from '../utils';

describe('Counter', () => {
  it('counter: linear increase', () => {
    const event = counter(1, 0, 0.5, { power: 1, steps: 4 });
    expect(event.next()).toEqual({ value: 0.125, done: false });
    expect(event.next()).toEqual({ value: 0.25, done: false });
    expect(event.next()).toEqual({ value: 0.375, done: false });
    expect(event.next()).toEqual({ value: 0.5, done: true });
  });

  it('Linear Decrease', () => {
    const event = counter(1, 1, 0.5, { power: 1, steps: 4 });
    expect(event.next()).toEqual({ value: 0.875, done: false });
    expect(event.next()).toEqual({ value: 0.75, done: false });
    expect(event.next()).toEqual({ value: 0.625, done: false });
    expect(event.next()).toEqual({ value: 0.5, done: true });
  });

  test('^2 Increase', () => {
    const event = counter(1, 0, 16, { power: 2, steps: 4 });
    expect(event.next()).toEqual({ value: 1, done: false });
    expect(event.next()).toEqual({ value: 4, done: false });
    expect(event.next()).toEqual({ value: 9, done: false });
    expect(event.next()).toEqual({ value: 16, done: true });
  });
});
