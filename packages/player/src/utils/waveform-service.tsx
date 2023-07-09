import * as React from 'react';

const cache: Record<string, number[]> = {};

export const withWaveform =
  <P extends {}>(Element: React.FC<P & { waveform: number[] }>) =>
  (props: { src: string } & P) => {
    const [waveform, setWaveform] = React.useState<number[]>([]);
    const { src } = props;

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

    return <Element {...(props as P)} waveform={waveform} />;
  };
