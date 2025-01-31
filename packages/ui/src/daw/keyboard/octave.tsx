import * as React from 'react';
import { colors } from '../../styles';

const keys = [
  { id: 'C' },
  { semi: true, id: 'C#', left: 9.2 },
  { id: 'D' },
  { semi: true, id: 'D#', left: 23.6 },
  { id: 'E' },
  { id: 'F' },
  { semi: true, id: 'F#', left: 52.1 },
  { id: 'G' },
  { semi: true, id: 'G#', left: 66.5 },
  { id: 'A' },
  { semi: true, id: 'A#', left: 81.5 },
  { id: 'B' }
].map((key, i) => ({ ...key, i }));

const whiteKeys = keys.filter((e) => !e.semi);
const blackKeys = keys.filter((e) => e.semi);

const roundness = '2px';

const height = 100;
const heightDiff = 25;

const defaultStyle = {
  display: 'block',
  border: 'none',
  borderBottomLeftRadius: roundness,
  borderBottomRightRadius: roundness,
  flexGrow: 0,
  boxShadow: '1px 3px 1px rgba(0, 0, 0, 0.2)',
  width: '14%',
  paddingTop: height + heightDiff,
  background: '#EEE'
} as const;

const blackStyle = {
  ...defaultStyle,
  background: colors.black,
  width: '10%',
  position: 'absolute',
  paddingTop: height
} as const;

const styles = {
  li: {
    listStyleType: 'none',
    cursor: 'pointer',
    display: 'flex',
    position: 'relative',
    width: '300px',
    userSelect: 'none',
    justifyContent: 'space-between',
    alignItems: 'start'
  },
  black: {
    active: '#333',
    base: blackStyle
  },
  white: {
    base: defaultStyle,
    active: '#DDD'
  }
} as const;

type keyProps = OctaveProps & {
  onActive: string;
  style: Omit<React.CSSProperties, 'paddingTop'> & { paddingTop: number };
  left?: string;
};

const Key = ({
  index,
  active,
  keyPress,
  keyUp,
  style,
  left,
  onActive
}: keyProps) => {
  const press = () => keyPress(index);
  const up = () => keyUp(index);

  const pressed = active.includes(index);

  return (
    <div
      style={{
        ...style,
        paddingTop: pressed ? (style.paddingTop ?? 0) - 10 : style.paddingTop,
        background: pressed ? onActive : style.background,
        left
      }}
      onTouchStart={press}
      onMouseDown={press}
      onTouchEnd={up}
      onMouseUp={up}
    />
  );
};

export type KeyHandler = (e: KeyboardEvent | number) => void;

type OctaveProps = {
  index: number;
  active: number[];
  keyPress: KeyHandler;
  keyUp: KeyHandler;
};

const Octave = ({ index, ...props }: OctaveProps) => (
  <li style={styles.li}>
    {whiteKeys.map(({ i }) => (
      <Key
        {...props}
        index={index * 12 + i}
        key={i}
        style={styles.white.base}
        onActive={styles.white.active}
      />
    ))}
    {blackKeys.map(({ i, left }) => (
      <Key
        {...props}
        left={left + '%'}
        index={index * 12 + i}
        key={i}
        style={styles.black.base}
        onActive={styles.black.active}
      />
    ))}
  </li>
);

export { Octave };
