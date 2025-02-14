import * as React from 'react';
import { usePreset } from '../hooks/use-preset';
import { TextButton } from '../../components/text-button';

const styles = {
  container: {
    margin: '5px',
    flexWrap: 'wrap',
    flexShrink: 0,
    padding: '5px'
  },
  label: {
    fontSize: '12px',
    margin: 0,
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#555',
    padding: '5px 0px'
  },
  list: {
    maxHeight: '70px',
    overflowY: 'scroll',
    padding: '6px 20px'
  }
} as const;

const Presets: React.FC = () => {
  const [{ name, names }, dispatch] = usePreset();

  return (
    <div style={styles.container}>
      <h3 style={styles.label}>Presets</h3>
      <div style={styles.list}>
        {names.map((id) => (
          <TextButton
            name={id}
            key={id}
            active={id === name}
            onClick={() => dispatch({ type: 'SET_PRESET', payload: id })}
          />
        ))}
      </div>
    </div>
  );
};

export default Presets;
