export type Tracked<T extends object> = T & {
  origin: T;
};

export type Mixed<T extends object> = Tracked<T> | T;

export type EditFunc<T> = (t: T) => Partial<T>;

export const mapTracked = <T extends object>(
  notes: Tracked<T>[],
  f: EditFunc<T>
): Tracked<T>[] =>
  notes.map((note) => (note.origin ? { ...note, ...f(note.origin) } : note));

export const addTracking = <T extends object>({ ...note }: T): Tracked<T> => ({
  ...note,
  origin: { ...note }
});

const drop = <T extends object>({ origin, ...n }: Tracked<T>): T => n as T;

export const dropTracking = <T extends object>(o: Mixed<T>): T =>
  'origin' in o ? drop(o) : o;
