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
  const [{ name: active, names }, dispatch] = usePreset();
  const [hover, setHover] = React.useState<string | undefined>(undefined);

  return (
    <div style={styles.container} onMouseLeave={() => setHover(undefined)}>
      <h3 style={styles.label}>Presets</h3>
      <div style={styles.list}>
        {names.map((name) => (
          <div
            key={name}
            onMouseOver={() => setHover(name)}
            style={{ background: hover === name ? '#00000010' : 'none' }}
          >
            <TextButton
              name={name}
              key={name}
              active={name === active}
              onClick={() => dispatch({ type: 'SET_PRESET', payload: name })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presets;
