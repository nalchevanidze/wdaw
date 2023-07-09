import * as React from 'react';
import { useContext, useState } from 'react';
import { Grid } from '../../utils/grid-line';
import { SvgStage, StageContext } from '@wdaw/svg';
import { ControlPoint, Point } from './control-point';
import { MouseEventHandler } from 'react';

import { positive, unitInterval } from '../../../utils/math';
import { EnvelopeConfig } from '../../../engine/oscillator/types';
import { ConfiguratorContext } from '../../configurator';
import { ENVELOPE_ID } from '../../../engine/types';
import { colors } from '../../styles';

type Points = Record<'start' | keyof EnvelopeConfig, Point>;
type Params = Record<'sustainX' | keyof EnvelopeConfig, number>;

const STAGE_WIDTH = 100;
const SUSTAIN_WIDTH = 10;

const toPoints = ({
  attack,
  release,
  sustain,
  decay,
  sustainX
}: Params): Points => ({
  start: [0, STAGE_WIDTH],
  attack: [attack, 0],
  sustain: [sustainX, sustain],
  decay: [decay, sustain],
  release: [release, STAGE_WIDTH]
});

const getParams = (env: EnvelopeConfig): Params => {
  const attack = env.attack * STAGE_WIDTH;
  const decay = attack + env.decay * STAGE_WIDTH;
  const sustainX = decay + SUSTAIN_WIDTH;
  const sustain = (1 - env.sustain) * STAGE_WIDTH;
  const release = sustainX + env.release * STAGE_WIDTH;

  return { attack, release, sustain, decay, sustainX };
};

type EnvelopeHandler = MouseEventHandler<SVGGElement>;

type Target = 'attack' | 'decay' | 'release';

type Props = {
  id: ENVELOPE_ID;
};

const type = 'SET_ENVELOPE';
const EnvelopeConsumer: React.FC<Props> = ({ id }) => {
  const [{ envelopes }, dispatch] = React.useContext(ConfiguratorContext);
  const getCoordinates = useContext(StageContext);
  const [target, setCurrent] = useState<Target | undefined>();

  const state = envelopes[id];
  const params = getParams(state);

  const clear = () => setCurrent(undefined);
  const setTarget = (name: Target) => () => setCurrent(name);
  const onMove: EnvelopeHandler = (event) => {
    const coordinates = getCoordinates(event);
    const x = positive(coordinates.x / 100);

    switch (target) {
      case 'attack':
        return dispatch({ type, id, payload: { attack: x } });
      case 'decay':
        return dispatch({
          type: 'SET_ENVELOPE',
          id,
          payload: {
            decay: positive(x - state.attack),
            sustain: 1 - unitInterval(coordinates.y / 100)
          }
        });
      case 'release':
        return dispatch({
          type,
          id,
          payload: { release: positive(x - params.sustainX / 100) }
        });
    }
  };

  const { start, attack, decay, release, sustain } = toPoints(params);

  return (
    <g
      onMouseMove={onMove}
      onMouseLeave={clear}
      onTouchEnd={clear}
      onMouseUp={clear}
    >
      <Grid />
      <g>
        <path
          stroke={colors.prime}
          fill={colors.prime}
          fillOpacity="0.10"
          d={'M' + [start, attack, decay, sustain, release]}
        />
        <g
          stroke={colors.prime}
          fill="none"
          strokeWidth="0.75"
          strokeOpacity={0.2}
        >
          <path d={'M' + [...decay, decay[0], STAGE_WIDTH]} />
          <path d={'M' + [sustain[0], 100, ...sustain]} />
        </g>
      </g>
      <g fillOpacity={0.8} fill="gray" stroke="#333">
        <ControlPoint xy={attack} onClick={setTarget('attack')} />
        <ControlPoint xy={decay} onClick={setTarget('decay')} />
        <ControlPoint xy={release} onClick={setTarget('release')} />
      </g>
    </g>
  );
};

const EnvelopeGraphic = (props: Props) => (
  <SvgStage viewBox="-5 -5 210 110" width="180px" height="100px">
    <EnvelopeConsumer {...props} />
  </SvgStage>
);

export default EnvelopeGraphic;
