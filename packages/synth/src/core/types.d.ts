export type Maybe<T> = T | undefined;

export type Note = {
  id: string;
  length: number;
  at: number;
};

export type PANEL_ID = 'filter' | 'sequence' | 'wave';

export type ENVELOPE_ID = 'gain' | 'filter';
