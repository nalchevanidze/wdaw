import * as React from 'react';
import { colors } from '../../styles';

const roundness = '2px';
const height = 100;
const heightDiff = 25;

const regular = {
  display: 'block',
  border: 'none',
  borderBottomLeftRadius: roundness,
  borderBottomRightRadius: roundness,
  flexGrow: 0,
  boxShadow: '1px 3px 1px rgba(0, 0, 0, 0.2)',
  width: '4.5%',
  paddingTop: height + heightDiff,
  background: '#EEE'
} as const;

const styles = {
  regular: {
    base: regular,
    pressedColor: '#DDD'
  } as const,
  semi: {
    pressedColor: '#333',
    base: {
      ...regular,
      background: colors.black,
      width: '3.5%',
      position: 'absolute',
      paddingTop: height
    }
  } as const,
  key: (pressed: boolean, fixed?: string) => {
    const { base, pressedColor } = fixed ? styles.semi : styles.regular;

    return {
      ...base,
      paddingTop: pressed ? (base.paddingTop ?? 0) - 10 : base.paddingTop,
      background: pressed ? pressedColor : base.background,
      left: fixed
    } as const;
  }
};

type Props = {
  fixed?: string;
  pressed: boolean;
  onKeyDown(): void;
  onKeyUp(): void;
};

export const Key: React.FC<Props> = ({
  pressed,
  onKeyDown,
  onKeyUp,
  fixed
}) => (
  <div
    style={styles.key(pressed, fixed)}
    onTouchStart={onKeyDown}
    onMouseDown={onKeyDown}
    onTouchEnd={onKeyUp}
    onMouseUp={onKeyUp}
  />
);
