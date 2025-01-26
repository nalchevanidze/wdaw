import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import { Track } from './track';
import { Timeline } from './timeline';
import { PANEL } from './defs';
import { NOTE, BLOCK } from '../common/units';
import { SvgStage } from '@wdaw/svg';
import { STAGE_HEIGHT } from './midi-loop';
import { colors } from '../styles';

export const TrackList: React.FC = () => {
  const [{ tracks, player }] = React.useContext(ConfiguratorContext);
  const maxTrackSize = Math.max(...tracks.tracks.map((t) => t.midi.end));
  const width = maxTrackSize * NOTE + PANEL + BLOCK;
  const position = player.time;
  const timelineHeight = 16;
  const height = STAGE_HEIGHT * tracks.tracks.length + timelineHeight;

  return (
    <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
      <SvgStage
        viewBox={[-PANEL, -timelineHeight, width, height].join(' ')}
        width={width}
        height={height}
      >
        <Timeline height={timelineHeight} />

        {tracks.tracks.map(({ midi, name }, i) => (
          <Track midi={midi} id={i} name={name} key={i} width={width} />
        ))}

        <rect y={-timelineHeight} height={height} width={1} x={position} fill={colors.critical} />
      </SvgStage>
    </div>
  );
};
