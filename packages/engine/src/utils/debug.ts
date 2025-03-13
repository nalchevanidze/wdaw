export const debug = (name: string, param: any) => {
  if ('DEBUG' in globalThis) {
    console.log(name, param);
  }
};

export const resourceIdGen = (name: string) => {
  let count = 0;
  const max = 5;

  const nextId = () => {
    count++;
    if (count >= max) {
      console.warn(`resource ${name} reached number ${count}!`);
    }
    return `${name}-${count}`;
  };

  return { nextId };
};
