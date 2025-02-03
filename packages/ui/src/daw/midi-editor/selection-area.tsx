import * as React from 'react';
import { Area } from '@wdaw/svg';

export const SelectionArea: React.FC<{ area: Area }> = ({ area: [start, end] }) => (
  <rect
    stroke="red"
    fill="red"
    fillOpacity={0.1}
    x={Math.min(start.x, end.x)}
    y={Math.min(start.y, end.y)}
    width={Math.abs(end.x - start.x)}
    height={Math.abs(end.y - start.y)}
  />
);