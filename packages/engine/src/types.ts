export type NoteAction = {
  start?: number[];
  end?: number[];
};

export type Note = {
  id: string;
  length: number;
  at: number;
};

export type PANEL_ID = 'filter' | 'sequence' | 'wave';

export type PLAYER_ACTION = 'play' | 'pause' | 'stop';

export type Midi = {
  start: number;
  end: number;
  loop: [number, number];
  notes: Note[];
};
