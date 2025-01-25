import * as React from 'react';
import { ConfiguratorContext, usePreset } from '../configurator';
import { colors } from '../styles';
import { presetNames } from '../../engine';

const styles = {
  container: {
    margin: '5px',
    flexWrap: 'wrap',
    flexShrink: 0,
    padding: '5px',

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
    padding: "6px 20px"
  },
  button: {
    display: 'block',
    color: 'white',
    outline: 'none',
    border: 'none',
    padding: '2px',
    width: '100%',
    cursor: 'pointer'
  }
} as const;

const PanelPresets: React.FC = () => {
  const [{ name: active }, dispatch] = usePreset();
  const [hover, setHover] = React.useState<string | undefined>(undefined);

  return (
    <div style={styles.container} onMouseLeave={() => setHover(undefined)}>
      <h3 style={styles.label}>Presets</h3>
      <div style={styles.list}>
        {presetNames.map((name) => (
          <button
            key={name}
            onMouseOver={() => setHover(name)}
            style={{
              ...styles.button,
              background: hover === name ? '#00000010' : 'none',
              color: colors.button(name === active)
            }}
            onClick={() => dispatch({ type: 'SET_PRESET', payload: name })}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PanelPresets;
