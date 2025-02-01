import * as React from 'react';
import { Track } from './track';
import { Timeline } from './timeline';
import { BLOCK, NOTE } from '../../common/units';
import { SvgStage } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { DawApiContext } from '../../context/state';

const panelWidth = 160;
const trackHeight = 48;

const styles = {
  container: {
    width: '100%',
    height: 'auto',
    position: 'relative'
  }
} as const;


const rulerSize = BLOCK;

export const TrackList: React.FC = () => {
  const [{ tracks, player }] = React.useContext(DawApiContext);
  const maxTrackSize = Math.max(...tracks.tracks.map((t) => t.midi.end));
  const width = maxTrackSize + panelWidth + rulerSize;
  const position = player.time;
  const timelineHeight = 32;
  const height = trackHeight * tracks.tracks.length + timelineHeight;

  return (
    <div style={styles.container}>
      <SvgStage
        viewBox={[-panelWidth, -timelineHeight, width, height].join(' ')}
        width={width}
        height={height}
      >
        <NoteGrid size={rulerSize} />
        <Timeline height={timelineHeight} size={rulerSize}/>

        {tracks.tracks.map(({ midi, name }, i) => {
          const y = i * trackHeight;

          return (
            <g key={i}>
              <Track
                accuracy={NOTE}
                id={i}
                midi={midi}
                height={trackHeight}
                y={y}
              />
              <Panel
                active={i === tracks.currentTrack}
                name={name}
                id={i}
                width={panelWidth}
                y={y}
                height={trackHeight}
              />
            </g>
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
