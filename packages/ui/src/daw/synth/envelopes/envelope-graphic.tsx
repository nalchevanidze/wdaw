import * as React from 'react';
import { useState } from 'react';
import { WaveGrid } from '../../../components/wave-grid';
import { Svg, Point as SVGPoint } from '@wdaw/svg';
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
  const p = getParams(state);

  const onMove = (target: string, point: SVGPoint) => {
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
          payload: { release: positive(x - p.sustainX / 100) }
        });
    }
  };

  return (
    <LineEditor
      onMove={onMove}
      height={STAGE_HEIGHT}
      controlers={[
        { point: [0, STAGE_HEIGHT] },
        { point: [p.attack, 0], id: 'attack' },
        {
          point: [p.decay, p.sustain],
          id: 'decay',
          emphasize: true
        },
        { point: [p.sustainX, p.sustain], emphasize: true },
        {
          point: [p.release, STAGE_HEIGHT],
          id: 'release'
        }
      ]}
    >
      <WaveGrid />
    </LineEditor>
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
