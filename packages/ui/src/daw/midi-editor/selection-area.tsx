import * as React from 'react';
import { IArea } from '@wdaw/svg';

export const SelectionArea: React.FC<{ area: IArea }> = ({ area }) => (
  <rect
    stroke="red"
    fill="red"
    fillOpacity={0.1}
    x={area.x1}
    y={area.y1}
    width={area.x2 - area.x1}
    height={area.y2 - area.y1}
  />
);
