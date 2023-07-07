import { counter } from "../utils";

describe("counter: linear increase", () => {
  const event = counter(1, 0, 0.5, {power:1, steps: 4});
  let percent: IteratorResult<number, any>;

  beforeEach(() => {
    percent = event.next();
  });

  test("call 1: must: 0.125 ", () => {
    expect(percent).toEqual({ value: 0.125, done: false });
  });
  test("call 2: must: 0.25 ", () => {
    expect(percent).toEqual({ value: 0.25, done: false });
  });
  test("call 3: must: 0.375 ", () => {
    expect(percent).toEqual({ value: 0.375, done: false });
  });
  test("call 4: must: 0.5 and Done ", () => {
    expect(percent).toEqual({ value: 0.5, done: true });
  });
});

describe("counter: Linear Decrease", () => {
  let event = counter(1, 1, 0.5, {power:1, steps: 4});

  it("call 1: must: 0.875 ", () => {
    let percent = event.next();
    expect(percent).toEqual({ value: 0.875, done: false });
  });

  it("call 2: must: 0.75 ", () => {
    let percent = event.next();
    expect(percent).toEqual({ value: 0.75, done: false });
  });

  it("call 3: must: 0.625 ", () => {
    let percent = event.next();
    expect(percent).toEqual({ value: 0.625, done: false });
  });

  it("call 4: must: 0.5 and Done ", () => {
    let percent = event.next();
    expect(percent).toEqual({ value: 0.5, done: true });
  });
});

describe("counter: ^2 Increase", () => {
  let event = counter(1, 0, 16, {power:2, steps: 4});
  let percent: IteratorResult<number, any>;

  beforeEach(() => {
    percent = event.next();
  });

  test("1: -> 1", () => {
    expect(percent).toEqual({ value: 1, done: false });
  });

  test("1: -> 4", () => {
    expect(percent).toEqual({ value: 4, done: false });
  });

  test("1: -> 0.125", () => {
    expect(percent).toEqual({ value: 9, done: false });
  });

  test("1: -> 0.125 , Done ", () => {
    expect(percent).toEqual({ value: 16, done: true });
  });
});
