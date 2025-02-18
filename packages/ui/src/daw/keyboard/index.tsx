import * as React from 'react';
import { Key } from './key';
import { useKeyboard } from '../hooks/use-keyboard';
import { allKeys } from './keys';

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
      {allKeys.map((octave) => (
        <li style={styles.octave}>
          {octave.map(({ left, semi, key }) => (
            <Key
              key={key}
              semi={semi}
              left={left}
              onKeyDown={() => onKeyDown(key)}
              onKeyUp={() => onKeyUp(key)}
              pressed={notes.includes(key)}
            />
          ))}
        </li>
      ))}
    </ul>
  );
};

export { Keyboard };
