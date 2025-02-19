import * as React from 'react';
import { colors } from '../styles';
import { getIcon, IconName } from './icons';

export type Props = {
  id: IconName;
  onClick(): void;
  color?: string;
};

export const IconButton = ({ id, onClick, color = colors.prime }: Props) => (
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
      d={getIcon(id)}
      fill="none"
    />
  </svg>
);
