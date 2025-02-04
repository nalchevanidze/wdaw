import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Svg, useSvgBoundaries } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { DawApiContext } from '../../context/state';
import { SelectionArea } from '../../common/selection-area';
import { useDragging } from '../hooks/use-dragging';
import { withAccuracy } from '../utils/area';
import { TState, useTrackEditor } from '../hooks/use-track-editor';
import { MidiLoop } from './midi-loop';
import { DragingBackground } from '../../common/background';

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

const toArea = ({ start, end, id }: TState): IArea => ({
  x1: start,
  x2: end,
  y1: id * trackHeight,
  y2: (id + 1) * trackHeight
});

export const Tracks: React.FC = () => {
  const [{ tracks }] = React.useContext(DawApiContext);

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
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <DragingBackground onMouseDown={dragging.onBackground} />
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
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

export const TrackList = () => {
  const [{ tracks }] = React.useContext(DawApiContext);
  const maxTrackSize = Math.max(...tracks.tracks.map((t) => t.midi.end));
  const canvasHeight = trackHeight * tracks.tracks.length;
  const timelineHeight = 32;

  return (
    <div style={styles.container}>
      <Svg
        width={maxTrackSize + rulerSize}
        height={canvasHeight}
        paddingLeft={panelWidth}
        paddingTop={timelineHeight}
      >
        <NoteGrid size={rulerSize} />
        <Tracks />
        <Timeline height={timelineHeight} size={rulerSize} />
      </Svg>
    </div>
  );
};
