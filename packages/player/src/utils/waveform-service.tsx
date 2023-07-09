import * as React from 'react';

const cache: Record<string, number[]> = {};

export const useWaveform = (src: string) => {
  const [waveform, setWaveform] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (cache[src]) {
      setWaveform(cache[src]);
    } else {
      fetch(src)
        .then((r) => r.json())
        .then((data) => {
          cache[src] = data;
          setWaveform(data);
        });
    }
  }, [src]);

  return waveform;
};
