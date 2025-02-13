import * as React from 'react';
import { useState } from 'react';
import { WaveGrid } from '../../../components/wave-grid';
import { Svg, usePoint } from '@wdaw/svg';
import { Point } from '../../../common/control-point';
import { MouseEventHandler } from 'react';
import { EnvelopeConfig, ENVELOPE_ID } from '@wdaw/engine';
import { usePreset } from '../../hooks/use-preset';
import { positive, unitInterval } from '../../utils/math';
import { Controler, LineEditor } from '../../../common/line-editor';

type Params = Record<'sustainX' | keyof EnvelopeConfig, number>;

const STAGE_WIDTH = 100;
const STAGE_HEIGHT = 100;
const SUSTAIN_WIDTH = 10;

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
  const [{ envelopes }, dispatch] = usePreset();
  const state = envelopes[id];
  const params = getParams(state);

  const toPoint = usePoint();
  const [target, setCurrent] = useState<Target | undefined>();
  const clear = () => setCurrent(undefined);
  const setTarget = (name: Target) => () => setCurrent(name);

  const onMove: EnvelopeHandler = (event) => {
    const point = toPoint(event);
    const x = positive(point.x / 100);

    switch (target) {
      case 'attack':
        return dispatch({ type, id, payload: { attack: x } });
      case 'decay':
        return dispatch({
          type: 'SET_ENVELOPE',
          id,
          payload: {
            decay: positive(x - state.attack),
            sustain: 1 - unitInterval(point.y / 100)
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

  return (
    <g
      onMouseMove={onMove}
      onMouseLeave={clear}
      onTouchEnd={clear}
      onMouseUp={clear}
    >
      <WaveGrid />
      <LineEditor
        height={STAGE_HEIGHT}
        controlers={[
          { point: [0, STAGE_HEIGHT] },
          { point: [params.attack, 0], onClick: setTarget('attack') },
          {
            point: [params.decay, params.sustain],
            onClick: setTarget('decay'),
            emphasize: true
          },
          { point: [params.sustainX, params.sustain], emphasize: true },
          {
            point: [params.release, STAGE_HEIGHT],
            onClick: setTarget('release')
          }
        ]}
      />
    </g>
  );
};

const padding = 5;
const width = 180;
const height = 120;

const EnvelopeGraphic = (props: Props) => (
  <Svg
    paddingLeft={padding}
    paddingTop={padding}
    width={width}
    height={height}
    zoom={0.8}
  >
    <EnvelopeConsumer {...props} />
  </Svg>
);

export default EnvelopeGraphic;
