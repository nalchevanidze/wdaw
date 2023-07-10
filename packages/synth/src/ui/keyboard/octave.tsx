import * as React from 'react';
import { colors } from '../styles';

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

const defaultStyle = {
  display: 'block',
  border: 'none',
  borderBottomLeftRadius: roundness,
  borderBottomRightRadius: roundness,
  flexGrow: 0,
  boxShadow: '1px 3px 1px rgba(0, 0, 0, 0.2)',
  width: '14%',
  paddingTop: '180px',
  background: '#EEE'
};

const blackStyle = {
  ...defaultStyle,
  background: colors.black,
  width: '10%',
  position: 'absolute',
  paddingTop: '140px'
} as const;

const StyleBlack = {
  active: {
    ...blackStyle,
    background: '#333',
    paddingTop: '135px'
  },
  default: blackStyle
};

const StyleWhite = {
  default: defaultStyle,
  active: {
    ...defaultStyle,
    background: '#DDD',
    paddingTop: '170px'
  }
};

const styles = {
  listStyleType: 'none',
  cursor: 'pointer',
  display: 'flex',
  position: 'relative',
  width: '300px',
  userSelect: 'none',
  justifyContent: 'space-between',
  alignItems: 'start'
} as const;

type keyProps = OctaveProps & {
  style: { active: React.CSSProperties; default: React.CSSProperties };
  left?: string;
};

const Key = ({ index, active, keyPress, keyUp, style, left }: keyProps) => {
  const press = () => keyPress(index);
  const up = () => keyUp(index);

  return (
    <div
      style={{
        ...(active.includes(index) ? style.active : style.default),
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
  <li style={styles}>
    {whiteKeys.map(({ i }) => (
      <Key {...props} index={index * 12 + i} key={i} style={StyleWhite} />
    ))}
    {blackKeys.map(({ i, left }) => (
      <Key
        {...props}
        left={left + '%'}
        index={index * 12 + i}
        key={i}
        style={StyleBlack}
      />
    ))}
  </li>
);

export { Octave };
