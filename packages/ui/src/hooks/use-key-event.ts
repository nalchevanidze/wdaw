import * as React from 'react';

type Handler = (m: KEY_EVENT_TYPE) => (e: KeyboardEvent) => void;

export type KEY_EVENT_TYPE = 'KEYBOARD/KEY_UP' | 'KEYBOARD/KEY_DOWN';

export const useKeyEvent = (f: Handler, args: unknown[] = []) => {
  const up = f('KEYBOARD/KEY_UP');
  const down = f('KEYBOARD/KEY_DOWN');

  React.useEffect(() => {
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, args);
};
