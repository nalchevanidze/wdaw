import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { SelectionArea } from '../../components/selection-area';
import { useDragging } from '../hooks/use-dragging';
import { withAccuracy } from '../utils/area';
import { TrackedTrack, useTrackEditor } from '../hooks/use-track-editor';
import { Fragment } from './fragment';
import { DragingBackground } from '../../components/background';
import { MidiID, useTracks } from '../hooks/use-tracks';
import { usePanels } from '../hooks/use-panels';

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

const toArea = ({ start, end, id: [trackIndex, _] }: TrackedTrack): IArea => ({
  x1: start,
  x2: end,
  y1: trackIndex * trackHeight,
  y2: (trackIndex + 1) * trackHeight
});

export const Tracks: React.FC = () => {
  const { tracks, clear, move, scale, select, selectIn, isSelected, sync } =
    useTrackEditor();
  const { panels } = usePanels();

  const dragging = useDragging<MidiID>({
    onMove: {
      select: selectIn(toArea),
      move: withAccuracy(move, accuracy),
      scale: withAccuracy(scale, accuracy)
    },
    onEnd: (mode) => (mode !== 'select' ? sync() : undefined),
    onStart: (t) => (!isSelected(t) ? select(t) : undefined),
    onBackground: () => {
      clear();
      return 'select';
    }
  });

  return (
    <g>
      <DragingBackground onMouseDown={dragging.onBackground} />
      {tracks.map(({ fragmentId, start, end, id, selected }, midiIndex) => (
        <Fragment
          key={midiIndex}
          y={id[0] * trackHeight}
          start={start}
          end={end}
          fragmentId={fragmentId}
          height={trackHeight}
          startMove={(e) => dragging.onElement('move')(e, id)}
          startScale={(e) => dragging.onElement('scale')(e, id)}
          color={selected ? colors.notesSelected : colors.notesBackground}
        />
      ))}
      {panels.map(({ name, index, active, gain, setGain, setTrack }) => (
        <Panel
          key={index}
          active={active}
          name={name}
          width={panelWidth}
          y={index * trackHeight}
          height={trackHeight}
          gain={gain}
          setGain={setGain}
          setTrack={setTrack}
        />
      ))}
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

export const TrackList = () => {
  const { count, length } = useTracks();
  const timelineHeight = 32;

  return (
    <div style={styles.container}>
      <Svg
        width={length + rulerSize}
        height={trackHeight * count}
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
