import * as React from 'react';

type Props = {
  color?: string;
  width?: number | string;
  height?: number | string;
};

export const WaveGrid: React.FC<Props> = ({
  color = '#FFEB3B',
  width = '100%',
  height = '100%'
}) => {
  const gridId = 'waveGridBig';
  const smallGridId = 'waveGridSmall';

  return (
    <>
      <defs>
        <pattern
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
          id={gridId}
        >
          <g stroke={color} fill="none" strokeWidth={0.3} strokeOpacity={0.3}>
            <pattern
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              id={smallGridId}
            >
              <path strokeWidth={0.3} d="M 10 0 L 0 0 0 10 0 0" />
            </pattern>
            <path d="M 100 0 L 0 0 0 100 0 0" />
            <rect width="100" height="100" fill={`url(#${smallGridId})`} />
          </g>
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${gridId})`} />
    </>
  );
};
