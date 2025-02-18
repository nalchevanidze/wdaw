import * as React from 'react';
import { Key } from './key';
import { useKeyboard } from '../hooks/use-keyboard';
import { allkeys } from './keys';

const styles = {
  container: {
    borderTop: '2px solid #c8c8c8',
    display: 'flex',
    padding: '0px',
    margin: '0px'
  },
  octave: {
    listStyleType: 'none',
    cursor: 'pointer',
    display: 'flex',
    position: 'relative',
    width: '180px',
    userSelect: 'none',
    justifyContent: 'space-between',
    alignItems: 'start'
  }
} as const;

const Keyboard: React.FC = () => {
  const { notes, onKeyDown, onKeyUp } = useKeyboard();

  return (
    <ul style={styles.container}>
      {[1, 2, 3].map((octave) => (
        <li style={styles.octave}>
          {allkeys.map(({ index, left, semi }) => {
            const key = octave * 12 + index;
            return (
              <Key
                key={key}
                semi={semi}
                left={left}
                onKeyDown={() => onKeyDown(key)}
                onKeyUp={() => onKeyUp(key)}
                pressed={notes.includes(key)}
              />
            );
          })}
        </li>
      ))}
    </ul>
  );
};

export { Keyboard };
