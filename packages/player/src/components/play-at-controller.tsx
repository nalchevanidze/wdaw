import * as React from 'react';
import LoadedGraph from './loaded-graph';
import { percentFromPoints, usePoint } from '@wdaw/svg';
import { RingComponentProps } from '../types';

type PlayAtControllerProps = RingComponentProps & {
  onClick: (pro: number) => void;
};

const PlayAtController: React.FC<PlayAtControllerProps> = ({
  annulus,
  sector,
  onClick
}) => {
  const toPoint = usePoint();

  return (
    <LoadedGraph
      annulus={annulus}
      sector={sector}
      onClick={(event) =>
        onClick(percentFromPoints(toPoint(event), annulus.center, sector))
      }
      fillOpacity={0}
    />
  );
};

export default PlayAtController;
