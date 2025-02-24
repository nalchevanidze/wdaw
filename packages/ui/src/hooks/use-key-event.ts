import * as React from 'react';

type Handler = (m: KEY_EVENT_TYPE) => (e: KeyboardEvent) => void;

export type KEY_EVENT_TYPE = 'KEYBOARD_KEY_UP' | 'KEYBOARD_KEY_DOWN';

export const useKeyEvent = (f: Handler, args: unknown[] = []) => {
  const up = f('KEYBOARD_KEY_UP');
  const down = f('KEYBOARD_KEY_DOWN');

  React.useEffect(() => {
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, args);
};
