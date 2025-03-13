export const debug = (name: string, param: any) => {
  console.log(globalThis);
  console.log(name, param);
};

export const debugIdGen = (name: string) => {
  let index = 0;

  return { nextId: () => `${name}-${index++}` };
};
