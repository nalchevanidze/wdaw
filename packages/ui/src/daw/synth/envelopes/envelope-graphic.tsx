import * as React from 'react';
import { useState } from 'react';
import { WaveGrid } from '../../../components/wave-grid';
import { Svg, usePoint } from '@wdaw/svg';
import { ControlPoint, Point } from '../../../common/control-point';
import { MouseEventHandler } from 'react';
import { colors } from '../../../styles';
import { EnvelopeConfig, ENVELOPE_ID } from '@wdaw/engine';
import { usePreset } from '../../hooks/use-preset';
import { positive, unitInterval } from '../../utils/math';

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

type Controler = {
  point: Point;
  onClick?: () => void;
};

const LineEditor: React.FC<{ controlers: Controler[] }> = ({ controlers }) => {
  return (
    <g>
      <path
        stroke={colors.prime}
        fill={colors.prime}
        fillOpacity="0.10"
        d={'M' + controlers.map((x) => x.point)}
      />
      <g fillOpacity={0.8} fill="gray" stroke="#333">
        {controlers.map((c, i) =>
          c.onClick ? (
            <ControlPoint xy={c.point} key={i} onClick={c.onClick} />
          ) : null
        )}
      </g>
    </g>
  );
};

const type = 'SET_ENVELOPE';
const EnvelopeConsumer: React.FC<Props> = ({ id }) => {
  const [{ envelopes }, dispatch] = usePreset();
  const toPoint = usePoint();
  const [target, setCurrent] = useState<Target | undefined>();

  const state = envelopes[id];
  const params = getParams(state);

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

  const { start, attack, decay, release, sustain } = toPoints(params);

  const controlers: Controler[] = [
    { point: start },
    { point: attack, onClick: setTarget('attack') },
    { point: decay, onClick: setTarget('decay') },
    { point: sustain },
    { point: release, onClick: setTarget('release') }
  ];

  return (
    <g
      onMouseMove={onMove}
      onMouseLeave={clear}
      onTouchEnd={clear}
      onMouseUp={clear}
    >
      <WaveGrid />
      <g>
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
      <LineEditor controlers={controlers} />
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
