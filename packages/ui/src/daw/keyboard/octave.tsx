import * as React from 'react';
import { colors } from '../../styles';

type Key = {
  index: number;
  left?: string;
  semi?: boolean;
};

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
].map(
  (key, index): Key => ({
    ...key,
    index,
    left: key.left ? key.left + '%' : undefined
  })
);

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
    pressedColor: '#333',
    base: blackStyle
  },
  white: {
    base: defaultStyle,
    pressedColor: '#DDD'
  }
} as const;

type keyProps = {
  left?: string;
  semi?: boolean;
  index: number;
  active: number[];
  keyPress: KeyHandler;
  keyUp: KeyHandler;
};

const Key = ({ index, active, keyPress, keyUp, left, semi }: keyProps) => {
  const press = () => keyPress(index);
  const up = () => keyUp(index);

  const pressed = active.includes(index);
  const { base, pressedColor } = semi ? styles.black : styles.white;

  return (
    <div
      style={{
        ...base,
        paddingTop: pressed ? (base.paddingTop ?? 0) - 10 : base.paddingTop,
        background: pressed ? pressedColor : base.background,
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
  octave: number;
  active: number[];
  keyPress: KeyHandler;
  keyUp: KeyHandler;
};

const allkeys: Key[] = [
  ...keys.filter((e) => !e.semi),
  ...keys.filter((e) => e.semi)
];

const Octave = ({ octave, ...props }: OctaveProps) => (
  <li style={styles.li}>
    {allkeys.map(({ index, left, semi }) => (
      <Key
        key={index}
        semi={semi}
        index={octave * 12 + index}
        left={left}
        {...props}
      />
    ))}
  </li>
);

export { Octave };
