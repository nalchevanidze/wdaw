import * as React from 'react';
import { colors } from '../../styles';

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
  black: {
    pressedColor: '#333',
    base: blackStyle
  } as const,
  white: {
    base: defaultStyle,
    pressedColor: '#DDD'
  } as const,
  key: (pressed: boolean, semi: boolean, left?: string) => {
    const { base, pressedColor } = semi ? styles.black : styles.white;

    return {
      ...base,
      paddingTop: pressed ? (base.paddingTop ?? 0) - 10 : base.paddingTop,
      background: pressed ? pressedColor : base.background,
      left
    } as const;
  }
};

type Props = {
  left?: string;
  semi: boolean;
  pressed: boolean;
  onKeyDown(): void;
  onKeyUp(): void;
};

export const Key: React.FC<Props> = ({
  pressed,
  onKeyDown,
  onKeyUp,
  left,
  semi
}) => (
  <div
    style={styles.key(pressed, semi, left)}
    onTouchStart={onKeyDown}
    onMouseDown={onKeyDown}
    onTouchEnd={onKeyUp}
    onMouseUp={onKeyUp}
  />
);
