import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Point, Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './panel';
import { NoteGrid } from '../../components/note-grid';
import { SelectionArea } from '../../components/selection-area';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { toAccuracy, withAccuracy } from '../utils/area';
import { UITrack, useTrackEditor } from '../hooks/use-track-editor';
import { Fragment } from './fragment';
import { DragingBackground } from '../../components/background';
import { useTracks } from '../hooks/use-tracks';
import { usePanels } from '../hooks/use-panels';
import { IconButton } from '../../components/icon-button';
import { MidiRef } from '@wdaw/engine';
import { DawApiContext } from '../../context/state';

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

const toArea = ({ start, end, trackIndex }: UITrack): IArea => ({
  x1: start,
  x2: end,
  y1: trackIndex * trackHeight,
  y2: (trackIndex + 1) * trackHeight
});

const normalizeY = (y: number) => Math.floor(y / trackHeight);

const normalize = ({ x, y }: Point): Point => ({
  x: Math.floor(x),
  y: normalizeY(y)
});

type ContentProps = {
  actionType: EditActionType;
  openDropDown(ref: MidiRef): void;
};

export const TracksContent: React.FC<ContentProps> = ({
  actionType,
  openDropDown
}) => {
  const { tracks, clear, move, scale, select, selectIn, sync, remove, addAt } =
    useTrackEditor();
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

  const mouseDownInactive: HandlerMap<EditActionType, UITrack> = {
    draw: remove,
    select: (t) => (!t.origin ? select(t) : undefined)
  };

  const dragging = useDragging<UITrack>({
    onMove: {
      select: selectIn(toArea),
      move: (x, y) => move(toAccuracy(x, accuracy), normalizeY(y)),
      scale: withAccuracy(scale, accuracy)
    },
    onEnd: (mode) => (mode !== 'select' ? sync() : undefined),
    onStart: mouseDownInactive[actionType],
    onBackground: onBackgroundHandler[actionType]
  });

  return (
    <g>
      <DragingBackground onMouseDown={dragging.onBackground} />
      {tracks.map((t, midiIndex) => (
        <Fragment
          key={midiIndex}
          y={t.trackIndex * trackHeight}
          start={t.start}
          end={t.end}
          fragmentId={t.fragmentId}
          height={trackHeight}
          selectFragment={() => openDropDown(t)}
          startMove={(e) => dragging.onElement('move')(e, t)}
          startScale={(e) => dragging.onElement('scale')(e, t)}
          color={t.origin ? colors.notesSelected : colors.notesBackground}
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
  const [{ midiFragments }, dispatch] = React.useContext(DawApiContext);
  const timelineHeight = 32;
  const [actionType, setActionType] = React.useState<EditActionType>('select');
  const [opened, setOpen] = React.useState<MidiRef | undefined>(undefined);

  return (
    <div style={styles.container}>
      {opened && (
        <div>
          <select
            name="fragments"
            value={opened.fragmentId}
            onChange={(e) => {
              dispatch({
                type: 'SET_MIDI_REF',
                id: opened,
                payload: e.target.value
              });
              setOpen(undefined);
            }}
          >
            {Object.keys(midiFragments).map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>{' '}
        </div>
      )}
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
          <TracksContent actionType={actionType} openDropDown={setOpen} />
          <Timeline height={timelineHeight} size={rulerSize} />
        </Svg>
      </section>
    </div>
  );
};
