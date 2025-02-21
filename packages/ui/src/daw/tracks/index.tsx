import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Point, Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { SelectionArea } from '../../components/selection-area';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { withAccuracy } from '../utils/area';
import { TrackedTrack, useTrackEditor } from '../hooks/use-track-editor';
import { Fragment } from './fragment';
import { DragingBackground } from '../../components/background';
import { MidiID, useTracks } from '../hooks/use-tracks';
import { usePanels } from '../hooks/use-panels';
import { IconButton } from '../../components/icon-button';

export type EditActionType = 'select' | 'draw';

const panelWidth = 160;
const trackHeight = 48;

const styles = {
  header: {
    display: 'flex',
    background: colors.background,
    padding: '5px',
    border: '0.05em solid #BBB',
    alignItems: 'center',
    gap: '5px'
  },
  container: {
    width: '100%',
    height: 'auto',
    position: 'relative'
  },
  canvas: {
    overflowX: 'scroll'
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

const normalize = ({ x, y }: Point): Point => ({
  x: Math.floor(x),
  y: Math.floor(y / trackHeight)
});

type ContentProps = {
  actionType: EditActionType;
};

export const TracksContent: React.FC<ContentProps> = ({ actionType }) => {
  const {
    tracks,
    clear,
    move,
    scale,
    select,
    selectIn,
    isSelected,
    sync,
    remove,
    addAt
  } = useTrackEditor();
  const { panels } = usePanels();

  const onBackgroundHandler: HandlerMap<EditActionType, Point> = {
    draw: (point) => {
      addAt(normalize(point));
      return 'scale';
    },
    select: () => {
      clear();
      return 'select';
    }
  };

  const mouseDownInactive: HandlerMap<EditActionType, MidiID> = {
    draw: remove,
    select: (t) => (!isSelected(t) ? select(t) : undefined)
  };

  const dragging = useDragging<MidiID>({
    onMove: {
      select: selectIn(toArea),
      move: withAccuracy(move, accuracy),
      scale: withAccuracy(scale, accuracy)
    },
    onEnd: (mode) => (mode !== 'select' ? sync() : undefined),
    onStart: mouseDownInactive[actionType],
    onBackground: onBackgroundHandler[actionType]
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

export const Tracks = () => {
  const { count, length, newTrack } = useTracks();
  const timelineHeight = 32;
  const [actionType, setActionType] = React.useState<EditActionType>('select');

  return (
    <div style={styles.container}>
      <section style={styles.header}>
        <button onClick={newTrack}>new track</button>
        <IconButton
          id="draw"
          onClick={() => setActionType('draw')}
          color={colors.button(actionType === 'draw')}
        />
        <IconButton
          id="select"
          color={colors.button(actionType === 'select')}
          onClick={() => setActionType('select')}
        />
      </section>
      <section style={styles.canvas}>
        <Svg
          width={length + rulerSize}
          height={trackHeight * count}
          paddingLeft={panelWidth}
          paddingTop={timelineHeight}
        >
          <NoteGrid size={rulerSize} />
          <TracksContent actionType={actionType} />
          <Timeline height={timelineHeight} size={rulerSize} />
        </Svg>
      </section>
    </div>
  );
};
