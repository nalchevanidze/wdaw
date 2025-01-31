import * as React from 'react';

type Handler = (m: KEY_EVENT_TYPE) => (e: KeyboardEvent) => void;

export type KEY_EVENT_TYPE = 'KEY_UP' | 'KEY_DOWN';

export const useKeyAction = (f: Handler, args: unknown[] = []) => {
  const up = f('KEY_UP');
  const down = f('KEY_DOWN');

  React.useEffect(() => {
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, args);
};

export const useOnDelete = (f: () => void, args: unknown[] = []) => {
  const deleteNotes = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace':
        return f();
    }
  };

  useKeyAction(deleteNotes, args);
};
