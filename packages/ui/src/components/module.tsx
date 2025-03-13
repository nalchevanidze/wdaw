import * as React from 'react';
import { colors } from '../styles';

const styles = {
  container: (disabled?: boolean) =>
    ({
      display: 'block',
      margin: '0',
      opacity: disabled ? 0.5 : 1,
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
  button: (disabled: boolean) =>
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
      background: disabled ? colors.black : colors.highlight
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
  label: string;
  children?: React.ReactNode;
  size?: number;
  color?: string;
  optional?: {
    disabled?: boolean;
    toggle(): void;
  };
};

export const Module: React.FC<Props> = ({
  label,
  children,
  size = 1,
  color = '#555',
  optional: controller
}) => {
  const disabled = Boolean(controller?.disabled);
  const optional = Boolean(controller);

  return (
    <div style={styles.container(disabled)}>
      <div style={styles.toggle(optional)} onClick={controller?.toggle}>
        {optional ? <div style={styles.button(disabled)} /> : null}
        <h3 style={styles.label(color)}>{label}</h3>
      </div>
      <div style={styles.grid(size)}>{children}</div>
    </div>
  );
};
