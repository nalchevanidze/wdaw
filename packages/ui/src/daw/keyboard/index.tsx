import * as React from 'react';
import { Key } from './key';
import { useKeyboard } from '../hooks/use-keyboard';
import { keys } from './keys';

const styles = {
  container: {
    borderTop: '2px solid #c8c8c8',
    display: 'flex',
    padding: '0px',
    margin: '0px',
    listStyleType: 'none',
    cursor: 'pointer',
    position: 'relative',
    userSelect: 'none',
    justifyContent: 'space-between',
    alignItems: 'start'
  }
} as const;

const Keyboard: React.FC = () => {
  const { notes, onKeyDown, onKeyUp } = useKeyboard();

  return (
    <ul style={styles.container}>
      {keys.map(({ fixed, key }) => (
        <Key
          key={key}
          fixed={fixed}
          onKeyDown={() => onKeyDown(key)}
          onKeyUp={() => onKeyUp(key)}
          pressed={notes.includes(key)}
        />
      ))}
    </ul>
  );
};

export { Keyboard };
