export type Maybe<T> = T | undefined;

declare class AudioWorkletProcessor {
  process(inputs: number[][][], outputs:number[][][], params: object): boolean;
}

declare function registerProcessor(a: string, b: unknown): void;
