import * as React from 'react';
import { colors } from '../styles';
import { CANVAS_HEIGHT, KEYBOARD_WIDTH } from './utils';
import { NOTE, BLOCK, QUARTER } from '../common/defs';
import { OCTAVE_SIZE } from '../../utils/notes';

const OCTAVE_HEIGHT = NOTE * OCTAVE_SIZE;

type KeysProps = {
  width: number;
  opacity?: number;
};

const Keys: React.FC<KeysProps> = ({ width, opacity = 1 }) => (
  <g fill="black" fillOpacity={opacity}>
    {[1, 3, 5, 8, 10].map((i) => (
      <rect key={i} y={i * NOTE} width={width} height={NOTE} />
    ))}
  </g>
);

const Keyboard = () => (
  <g>
    <defs>
      <pattern
        width={QUARTER}
        height={OCTAVE_HEIGHT}
        patternUnits="userSpaceOnUse"
        id="start_keys"
      >
        <Keys width={BLOCK} />
      </pattern>
    </defs>
    <rect
      x={-KEYBOARD_WIDTH}
      width={KEYBOARD_WIDTH}
      height={CANVAS_HEIGHT}
      fill="url(#start_keys)"
      stroke={colors.black}
    />
  </g>
);

const VerticalLine: React.FC<{ x: number; strength: number }> = ({
  x,
  strength
}) => (
  <line
    x1={x}
    x2={x}
    y1={0}
    y2={OCTAVE_HEIGHT}
    stroke="black"
    fill="none"
    strokeWidth={strength * 0.5}
  />
);

const Grid = () => (
  <g>
    <defs>
      <pattern
        width={NOTE}
        height={OCTAVE_HEIGHT}
        patternUnits="userSpaceOnUse"
        id="quart"
      >
        <VerticalLine x={NOTE} strength={0.1} />
      </pattern>
      <pattern
        width={BLOCK}
        height={OCTAVE_HEIGHT}
        patternUnits="userSpaceOnUse"
        id="key"
      >
        <Keys width={BLOCK} opacity={0.07} />
        <rect width={BLOCK} height={OCTAVE_HEIGHT} fill="url(#quart)" />
        <VerticalLine x={QUARTER} strength={0.2} />
        <VerticalLine x={QUARTER * 2} strength={0.4} />
        <VerticalLine x={QUARTER * 3} strength={0.2} />
        <VerticalLine x={BLOCK} strength={2} />
      </pattern>
    </defs>
    <rect
      width="100%"
      height={CANVAS_HEIGHT}
      fill="url(#key)"
      className="grids"
    />
  </g>
);

type Props = Pick<React.SVGProps<SVGRectElement>, 'onMouseDown'> & {
  loop: [number, number];
  width: number;
};

const Background: React.FC<Props> = ({
  onMouseDown,
  loop: [loopStart, loopEnd],
  width
}) => {
  const start = loopStart * QUARTER;
  const size = (loopEnd - loopStart) * QUARTER;

  return (
    <>
      <Grid />
      <Keyboard />
      <rect
        fillOpacity={0.5}
        x={start}
        width={size}
        height={4}
        onMouseDown={onMouseDown}
        fill="red"
      />
      <rect
        fillOpacity={0.3}
        x={start + size}
        width={1}
        height={CANVAS_HEIGHT}
        onMouseDown={onMouseDown}
        fill="red"
      />
      <rect
        fillOpacity={0.3}
        x={start}
        width={1}
        height={CANVAS_HEIGHT}
        onMouseDown={onMouseDown}
        fill="red"
      />
      <rect
        fillOpacity={0}
        width={width}
        height={CANVAS_HEIGHT}
        onMouseDown={onMouseDown}
      />
    </>
  );
};

export { Background };
