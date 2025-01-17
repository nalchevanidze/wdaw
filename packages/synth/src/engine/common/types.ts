export type Maybe<T> = T | undefined;

export type Sequence = Record<number, Maybe<number[]>> & { enabled?: boolean };
