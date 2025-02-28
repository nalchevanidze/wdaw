import * as React from 'react';

type Handler = (e: KeyboardEvent) => void;

type Handlers = {
  down: Handler;
  up?: Handler;
};

export const useKeyEvent = ({ down, up }: Handlers, args: unknown[] = []) => {
  React.useEffect(() => {
    document.addEventListener('keydown', down);
    if (up) {
      document.addEventListener('keyup', up);
    }

    return () => {
      document.removeEventListener('keydown', down);
      if (up) {
        document.removeEventListener('keyup', up);
      }
    };
  }, args);
};
