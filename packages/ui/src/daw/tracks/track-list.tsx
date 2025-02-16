import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { DawApiContext } from '../../context/state';
import { SelectionArea } from '../../components/selection-area';
import { useDragging } from '../hooks/use-dragging';
import { withAccuracy } from '../utils/area';
import {
  eqID,
  MidiID,
  TState,
  useTrackEditor
} from '../hooks/use-track-editor';
import { Fragment } from './fragment';
import { DragingBackground } from '../../components/background';
import { useTracks } from '../hooks/use-tracks';

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
const accuracy = rulerSize / 8;

const toArea = ({ start, end, id: [trackIndex, _] }: TState): IArea => ({
  x1: start,
  x2: end,
  y1: trackIndex * trackHeight,
  y2: (trackIndex + 1) * trackHeight
});

export const Tracks: React.FC = () => {
  const { tracks, currentTrack } = useTracks();

  const { all, clear, move, scale, select, selectIn, isSelected, sync } =
    useTrackEditor();

  const dragging = useDragging<MidiID>({
    onMove: {
      select: selectIn(toArea),
      move: withAccuracy(move, accuracy),
      scale: withAccuracy(scale, accuracy)
    },
    onEnd: (mode) => (mode !== 'select' ? sync() : undefined),
    onStart: (t) => {
      if (!isSelected(t)) {
        select(t);
      }
    },
    onBackground: () => {
      clear();
      return 'select';
    }
  });

  const ts = tracks.map(({ midi, name }, trackIndex) => ({
    index: trackIndex,
    active: trackIndex === currentTrack,
    name,
    midi: midi.map(({ fragmentId, start, end }, midiIndex) => {
      const id: MidiID = [trackIndex, midiIndex];
      const { origin, ...state } = all.find(eqID(id)) ?? {
        start,
        end,
        fragmentId,
        id
      };
      const selected = Boolean(origin);

      return { selected, ...state };
    })
  }));

  return (
    <g>
      <DragingBackground onMouseDown={dragging.onBackground} />
      {ts.map(({ midi, name, index, active }) => {
        const y = index * trackHeight;
        return (
          <g key={index}>
            {midi.map(({ fragmentId, start, end, id, selected }, midiIndex) => (
              <Fragment
                key={midiIndex}
                y={y}
                start={start}
                end={end}
                fragmentId={fragmentId}
                height={trackHeight}
                startMove={(e) => dragging.onElement('move')(e, id)}
                startScale={(e) => dragging.onElement('scale')(e, id)}
                color={selected ? colors.notesSelected : colors.notesBackground}
              />
            ))}
            <Panel
              active={active}
              name={name}
              id={index}
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
