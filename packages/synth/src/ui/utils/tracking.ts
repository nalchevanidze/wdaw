export type Tracked<T> = T & {
  origin: T;
};

export const addTracking = <T extends object>({ ...note }: T): Tracked<T> => ({
  ...note,
  origin: { ...note }
});

export const dropTracking = <T extends object>({
  origin,
  ...n
}: Tracked<T>): T => n as T;
