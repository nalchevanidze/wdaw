import * as React from 'react';
import { colors } from '../../styles';
import { usePreset } from '../hooks/use-preset';
import { PANEL_ID } from '../../state/types';

const styles = {
  label: (color: string) =>
    ({
      color,
      fontSize: '12px',
      margin: '0',
      width: '100%',
      textAlign: 'center',
      textTransform: 'uppercase',
      userSelect: 'none'
    }) as const,
  toggle: (optional?: boolean) => ({
    display: 'flex',
    height: 10,
    cursor: optional ? 'pointer' : 'default'
  }),
  button: (active: boolean) => ({
    display: 'block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    margin: '2px',
    border: '2px solid #888888',
    padding: '0px',
    cursor: 'pointer',
    flexShrink: 0,
    background: active ? colors.highlight : colors.black
  }),
  grid: (size: number, active?: boolean) =>
    ({
      display: 'flex',
      margin: '5px',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      flexShrink: '0',
      width: `${size * 50 + (size - 1) * 20}px`,
      opacity: active ? 1 : 0.5
    }) as const
};

export type Props = {
  id?: PANEL_ID;
  label: string;
  size?: number;
  children?: React.ReactNode;
  isActive?: boolean;
  color?: string;
  optional?: boolean;
};

const Panel: React.FC<Props> = ({
  children,
  label,
  size = 1,
  color = '#555',
  optional,
  id
}) => {
  const [config, dispatch] = usePreset();
  const target = id ? config[id] : undefined;

  const toggle = () =>
    id ? dispatch({ type: 'TOGGLE_PANEL', id }) : undefined;
  const active =
    (optional && target && 'enabled' in target && target.enabled) || !optional;

  const grid = styles.grid(size, active);

  return (
    <div style={grid}>
      <div
        style={styles.toggle(optional)}
        onClick={optional ? toggle : undefined}
      >
        {optional ? <div style={styles.button(active)} /> : null}
        <h3 style={styles.label(color)}>{label}</h3>
      </div>
      <div style={grid}>{children}</div>
    </div>
  );
};

export { Panel };
