export type Tracked<T> = T & {
  origin: T;
};

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

export const dropTracking = <T extends object>({
  origin,
  ...n
}: Tracked<T>): T => n as T;
