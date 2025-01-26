import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import { Track } from './track';
import { Timeline } from './timeline';
import { TRACK_HEIGHT } from './defs';
import { NOTE, BLOCK } from '../common/units';
import { SvgStage } from '@wdaw/svg';
import { colors } from '../styles';
import { Panel } from './panel';

const PANEL = 64;

export const TrackList: React.FC = () => {
  const [{ tracks, player }] = React.useContext(ConfiguratorContext);
  const maxTrackSize = Math.max(...tracks.tracks.map((t) => t.midi.end));
  const width = maxTrackSize * NOTE + PANEL + BLOCK;
  const position = player.time;
  const timelineHeight = 16;
  const height = TRACK_HEIGHT * tracks.tracks.length + timelineHeight;

  return (
    <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
      <SvgStage
        viewBox={[-PANEL, -timelineHeight, width, height].join(' ')}
        width={width}
        height={height}
      >
        <Timeline height={timelineHeight} />

        {tracks.tracks.map(({ midi, name }, i) => {
          const y = i * TRACK_HEIGHT;

          return (
            <>
              <Panel
                active={i === tracks.currentTrack}
                name={name}
                id={0}
                width={PANEL}
                y={y}
              />
              <Track key={i} id={i} midi={midi} width={width} y={y} />
            </>
          );
        })}

        <rect
          y={-timelineHeight}
          height={height}
          width={1}
          x={position}
          fill={colors.critical}
        />
      </SvgStage>
    </div>
  );
};
