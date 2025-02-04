import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { DawApiContext } from '../../context/state';
import { SelectionArea } from '../../common/selection-area';
import { useDragging } from '../hooks/use-dragging';
import { withAccuracy } from '../utils/area';
import { TState, useTrackEditor } from '../hooks/use-track-editor';
import { MidiLoop } from './midi-loop';

const panelWidth = 160;
const trackHeight = 48;
const timelineHeight = 32;

const styles = {
  container: {
    width: '100%',
    height: 'auto',
    position: 'relative'
  }
} as const;

const rulerSize = BLOCK;

export const Tracks: React.FC<{
  canvasHeight: number;
}> = ({ canvasHeight }) => {
  const [{ tracks, player }] = React.useContext(DawApiContext);

  const accuracy = rulerSize / 8;
  const { all, clear, move, scale, select } = useTrackEditor(tracks.tracks);

  const dragging = useDragging<number>({
    onMove: {
      select: () => undefined,
      move: withAccuracy(move, accuracy),
      scale: withAccuracy(scale, accuracy)
    },
    onEnd: clear,
    onStart: (t) => select(t)
  });

  return (
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <rect
        y={0}
        onMouseDown={dragging.onBackground}
        height={canvasHeight}
        width="100%"
        opacity={0}
      />
      {tracks.tracks.map(({ midi, name }, i) => {
        const y = i * trackHeight;
        const state = all.find((s) => s.id === i) ?? midi;

        return (
          <g key={i}>
            <MidiLoop
              y={y}
              start={state?.start}
              end={state?.end}
              midi={midi}
              height={trackHeight}
              startMove={(e) => dragging.onStart('move')(e, i)}
              startScale={(e) => dragging.onStart('scale')(e, i)}
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
        height={canvasHeight + timelineHeight}
        width={1}
        x={player.time}
        fill={colors.critical}
      />
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

export const TrackList = () => {
  const [{ tracks }] = React.useContext(DawApiContext);
  const maxTrackSize = Math.max(...tracks.tracks.map((t) => t.midi.end));
  const canvasHeight = trackHeight * tracks.tracks.length;

  return (
    <div style={styles.container}>
      <Svg
        width={maxTrackSize + rulerSize}
        height={canvasHeight}
        paddingLeft={panelWidth}
        paddingTop={timelineHeight}
      >
        <NoteGrid size={rulerSize} />
        <Timeline height={timelineHeight} size={rulerSize} />
        <Tracks canvasHeight={canvasHeight} />
      </Svg>
    </div>
  );
};
