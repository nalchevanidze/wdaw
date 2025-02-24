const makeLib = <O extends { id: string }>(mp: O[]): Record<string, O> =>
  Object.fromEntries(mp.map((p) => [p.id, p]));