import * as React from 'react';
import { useSvgBoundaries } from '@wdaw/svg';
import { MHandler } from '../daw/types';

type Props = {
  onMouseDown: MHandler;
};

export const DragingBackground: React.FC<Props> = ({ onMouseDown }) => {
  const { height, width } = useSvgBoundaries();

  return (
    <rect
      y={0}
      onMouseDown={onMouseDown}
      height={height}
      width={width}
      opacity={0}
    />
  );
};
