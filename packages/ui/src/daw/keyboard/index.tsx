import * as React from 'react';
import { KEY_EVENT_TYPE, useKeyAction } from '../utils/key-actions';
import { KeyHandler, Octave } from './octave';
import { DawApiContext } from '../../context/state';
import { noteFromKeyboard } from '../utils/keyboard';

const Keyboard: React.FC = () => {
  const [{ player }, dispatch] = React.useContext(DawApiContext);

  const handler =
    (type: KEY_EVENT_TYPE): KeyHandler =>
    (e) => {
      const key = noteFromKeyboard(e);
      if (key) {
        dispatch({ type, payload: key });
      }
    };

  useKeyAction(handler);

  return (
    <ul
      style={{
        borderTop: '2px solid #c8c8c8',
        display: 'flex',
        padding: '0px',
        margin: '0px'
      }}
    >
      {[1, 2, 3].map((i) => (
        <Octave
          key={i}
          octave={i}
          keyPress={handler('KEY_DOWN')}
          keyUp={handler('KEY_UP')}
          active={player.notes}
        />
      ))}
    </ul>
  );
};

export { Keyboard };
