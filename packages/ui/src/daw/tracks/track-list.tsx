import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Svg } from '@wdaw/svg';
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

const toArea = ({ start, end, id }: TState): IArea => ({
  x1: start,
  x2: end,
  y1: id * trackHeight,
  y2: (id + 1) * trackHeight
});

export const Tracks: React.FC<{
  canvasHeight: number;
}> = ({ canvasHeight }) => {
  const [{ tracks, player }] = React.useContext(DawApiContext);

  const accuracy = rulerSize / 8;
  const { all, clear, move, scale, select, selectIn, selection, sync } =
    useTrackEditor(tracks.tracks);

  const dragging = useDragging<number>({
    onMove: {
      select: selectIn(toArea),
      move: withAccuracy(move, accuracy),
      scale: withAccuracy(scale, accuracy)
    },
    onEnd: (mode) => (mode !== 'select' ? sync() : undefined),
    onStart: (t) => {
      if (!selection) {
        select(t);
      }
    },
    onBackground: () => {
      clear();
      return 'select';
    }
  });

  return (
    <>
      <rect
        y={0}
        onMouseDown={dragging.onBackground}
        height={canvasHeight}
        width="100%"
        opacity={0}
      />
      <g
        onMouseMove={dragging.onMove}
        onMouseLeave={dragging.end}
        onMouseUp={dragging.end}
      >
        {tracks.tracks.map(({ midi, name }, i) => {
          const y = i * trackHeight;
          const state = all.find((s) => s.id === i);

          return (
            <g key={i}>
              <MidiLoop
                y={y}
                start={state?.start ?? midi.start}
                end={state?.end ?? midi.end}
                midi={midi}
                height={trackHeight}
                startMove={(e) => dragging.onStart('move')(e, i)}
                startScale={(e) => dragging.onStart('scale')(e, i)}
                color={
                  state?.origin ? colors.notesSelected : colors.notesBackground
                }
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
    </>
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
