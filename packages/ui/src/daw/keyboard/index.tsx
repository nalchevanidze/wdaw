import * as React from 'react';
import { Octave } from './octave';
import { useKeyboard } from '../hooks/use-keyboard';

const Keyboard: React.FC = () => {
  const { notes, onKeyDown, onKeyUp } = useKeyboard();

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
          keyPress={onKeyDown}
          keyUp={onKeyUp}
          active={notes}
        />
      ))}
    </ul>
  );
};

export { Keyboard };
