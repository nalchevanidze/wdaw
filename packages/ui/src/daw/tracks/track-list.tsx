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
import {
  eqID,
  MidiID,
  TState,
  useTrackEditor
} from '../hooks/use-track-editor';
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

const toArea = ({ start, end, id: [trackIndex, _] }: TState): IArea => ({
  x1: start,
  x2: end,
  y1: trackIndex * trackHeight,
  y2: (trackIndex + 1) * trackHeight
});

export const Tracks: React.FC = () => {
  const [{ tracks, currentTrack }] = React.useContext(DawApiContext);

  const accuracy = rulerSize / 8;
  const { all, clear, move, scale, select, selectIn, selection, sync } =
    useTrackEditor(tracks);

  const dragging = useDragging<MidiID>({
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
      {tracks.map(({ midi, name }, trackIndex) => {
        const y = trackIndex * trackHeight;

        return (
          <g key={trackIndex}>
            {midi.map(({ fragmentId, start, end }, midiIndex) => {
              const id: MidiID = [trackIndex, midiIndex];
              const state = all.find((s) => eqID(s.id, id));
              return (
                <MidiLoop
                  key={midiIndex}
                  y={y}
                  start={state?.start ?? start}
                  end={state?.end ?? end}
                  fragmentId={fragmentId}
                  height={trackHeight}
                  startMove={(e) => dragging.onStart('move')(e, id)}
                  startScale={(e) => dragging.onStart('scale')(e, id)}
                  color={
                    state?.origin
                      ? colors.notesSelected
                      : colors.notesBackground
                  }
                />
              );
            })}
            <Panel
              active={trackIndex === currentTrack}
              name={name}
              id={trackIndex}
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
  const maxTrackSize = Math.max(
    ...tracks.flatMap((t) => t.midi.map((x) => x.end))
  );
  const canvasHeight = trackHeight * tracks.length;
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
