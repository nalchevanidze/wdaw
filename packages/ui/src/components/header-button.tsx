import * as React from 'react';
import { colors } from '../styles';

const iconLib = {
  play: 'M20 0 L 90 50 20 100Z',
  pause: 'M30,100V0 M70,0v100',
  stop: 'M5 5 L 95 5 95 95 5 95z',
  draw: 'M72 15.2L20 68 14 88l19.4-6.6L90 23.6 73.7 7.8',
  select: 'M71 71L25.4 27M58.5 27.4l-33-.7.3 34'
};

export type ActionType = keyof typeof iconLib;

export type HeaderButtonProps = {
  id: ActionType;
  onClick(): void;
  color?: string;
};

const HeaderButton = ({
  id,
  onClick,
  color = colors.prime
}: HeaderButtonProps) => (
  <svg
    viewBox={[0, 0, 100, 100].join(' ')}
    width="20px"
    height="20px"
    onClick={onClick}
    style={{ cursor: 'pointer', padding: '5px' }}
  >
    <path
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      d={iconLib[id]}
      fill="none"
    />
  </svg>
);

export default HeaderButton;
