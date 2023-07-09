import * as React from 'react';

type Props<T> = {
  observable: () => T | undefined;
  children: ({}) => React.ReactElement;
};

const AnimationFrame = <T extends {}>({ observable, children }: Props<T>) => {
  const [state, setState] = React.useState<T | undefined>(undefined);
  const ref = React.useRef<number>(0);

  const refresh = () => {
    setState(observable());
    ref.current = requestAnimationFrame(refresh);
  };

  React.useEffect(() => {
    refresh();
    return () => cancelAnimationFrame(ref.current);
  }, []);

  return state ? children(state) : null;
};

export default AnimationFrame;
