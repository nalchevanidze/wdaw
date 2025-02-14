import * as React from 'react';
import { colors } from '../../styles';
import { usePreset } from '../hooks/use-preset';
import { PANEL_ID } from '../../state/types';

const styles = {
  container: (active?: boolean) =>
    ({
      display: 'block',
      margin: '0',
      opacity: active ? 1 : 0.5,
      flexShrink: 0,
      padding: '8px'
    }) as const,
  label: (color: string) =>
    ({
      color,
      fontSize: '12px',
      margin: '0',
      width: '100%',
      textTransform: 'capitalize',
      userSelect: 'none'
    }) as const,
  toggle: (optional?: boolean) =>
    ({
      display: 'flex',
      height: 10,
      cursor: optional ? 'pointer' : 'default'
    }) as const,
  button: (active: boolean) =>
    ({
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
    }) as const,
  grid: (size: number) =>
    ({
      display: 'grid',
      margin: 0,
      paddingTop: '12px',
      gap: '6px',
      gridTemplateColumns: Array.from({ length: size }, () => '1fr').join(' ')
    }) as const
};

type Props = {
  id?: PANEL_ID;
  label: string;
  size?: number;
  children?: React.ReactNode;
  isActive?: boolean;
  color?: string;
  optional?: boolean;
};

export const Panel: React.FC<Props> = ({
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

  return (
    <div style={styles.container(active)}>
      <div
        style={styles.toggle(optional)}
        onClick={optional ? toggle : undefined}
      >
        {optional ? <div style={styles.button(active)} /> : null}
        <h3 style={styles.label(color)}>{label}</h3>
      </div>
      <div style={styles.grid(size)}>{children}</div>
    </div>
  );
};
