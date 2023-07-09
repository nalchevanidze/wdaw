import * as React from 'react';
import { noteFromKeyboard } from '../../utils/keyboard';
import { ConfiguratorContext } from '../configurator';
import { KEY_EVENT_TYPE, useKeyAction } from '../utils';
import { KeyHandler, Octave } from './octave';

const Keyboard: React.FC = ({}) => {
  const [{ notes }, dispatch] = React.useContext(ConfiguratorContext);

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
          index={i}
          keyPress={handler('KEY_DOWN')}
          keyUp={handler('KEY_UP')}
          active={notes}
        />
      ))}
    </ul>
  );
};

export { Keyboard };
