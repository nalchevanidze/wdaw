import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { IArea, Point, Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './channel';
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
  },
  selectFragment: {
    borderRadius: '5px',
    padding: '5px',
    border: ' 1px solid gray',
    display: 'flex',
    gap: '10px'
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
  x: toAccuracy(x, accuracy),
  y: normalizeY(y)
});

type ContentProps = {
  actionType: EditActionType;
  openDropDown(ref?: MidiRef): void;
};

export const TracksContent: React.FC<ContentProps> = ({
  actionType,
  openDropDown
}) => {
  const {
    tracks,
    clear,
    move,
    scale,
    setCurrent,
    select,
    selectIn,
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
      openDropDown(undefined);
      clear();
      return 'select';
    }
  };

  const mouseDownInactive: HandlerMap<EditActionType, UITrack> = {
    draw: remove,
    select: (t) => {
      if (t.origin) return;

      setCurrent(t.fragmentId);
      select(t);
      openDropDown(t);
    }
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
  const { count, length, newTrack, currentTrack, current } = useTracks();
  const [{ midiFragments }, dispatch] = React.useContext(DawApiContext);
  const timelineHeight = 32;
  const [actionType, setActionType] = React.useState<EditActionType>('select');
  const [opened, setOpen] = React.useState<MidiRef | undefined>(undefined);

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
        <div>
          <label htmlFor="track-name">Current Track: </label>
          <input
            id="track-name"
            type="text"
            value={current.name}
            onChange={({ target }) =>
              dispatch({
                type: 'SET_TRACK',
                id: currentTrack,
                payload: { name: target.value }
              })
            }
          />
        </div>
        {opened && (
          <div style={styles.selectFragment}>
            <label htmlFor="select-fragment"> Select Fragment</label>
            <select
              id="select-fragment"
              name="fragments"
              value={opened.fragmentId}
              onChange={({ target }) => {
                dispatch({
                  type: 'SET_MIDI_REF',
                  id: opened,
                  payload: target.value
                });
                setOpen(undefined);
              }}
            >
              {Object.keys(midiFragments).map((value) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          </div>
        )}
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
