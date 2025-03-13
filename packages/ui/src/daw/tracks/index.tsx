import * as React from 'react';
import { Timeline } from './timeline';
import { BLOCK } from '../../common/units';
import { Point, Svg } from '@wdaw/svg';
import { colors } from '../../styles';
import { Panel } from './channel';
import { NoteGrid } from '../../components/note-grid';
import { SelectionArea } from '../../components/selection-area';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { toAccuracy } from '../utils/area';
import { useTrackEditor } from '../hooks/use-track-editor';
import { Fragment } from './fragment';
import { DragingBackground } from '../../components/background';
import { useTracks } from '../hooks/use-tracks';
import { usePanels } from '../hooks/use-panels';
import { IconButton } from '../../components/icon-button';
import { MidiRef } from '@wdaw/engine';
import { NameInput } from '../../components/name-input';
import { DropDown } from '../../components/drop-down';
import { useMidiFragment } from '../hooks/use-midi-fragment';
import { Mixed } from '../utils/tracking';
import { BpmEditor } from './bpmEditor';

export type EditActionType = 'select' | 'draw';

const panelWidth = 160;
const trackHeight = 48;
const bpmHeight = 60;

const styles = {
  header: {
    display: 'flex',
    background: colors.background,
    padding: '5px',
    border: '0.05em solid #BBB',
    alignItems: 'center',
    gap: '5px'
  },
  bar: {
    display: 'flex',
    background: colors.background,
    padding: '4px',
    border: '1px solid gray',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '5px'
  },
  container: {
    width: '100%',
    height: 'auto',
    position: 'relative'
  },
  canvas: {
    display: 'grid',
    overflowX: 'scroll'
  }
} as const;

const rulerSize = BLOCK;
const accuracy = rulerSize / 8;

type ContentProps = {
  actionType: EditActionType;
  openDropDown(ref?: MidiRef): void;
};

export const TracksContent: React.FC<ContentProps> = ({
  actionType,
  openDropDown
}) => {
  const {
    all,
    clear,
    move,
    scale,
    setCurrent,
    select,
    selectIn,
    sync,
    remove,
    addAt
  } = useTrackEditor({
    scaleX: (x) => x,
    accuracyX: toAccuracy(accuracy),
    accuracyY: Math.round,
    scaleY: (y) => y / trackHeight
  });

  const { panels } = usePanels();

  const onBackgroundHandler: HandlerMap<EditActionType, Point> = {
    draw: (point) => {
      addAt(point);
      return 'scale';
    },
    select: () => {
      openDropDown(undefined);
      clear();
      return 'select';
    }
  };

  const mouseDownInactive: HandlerMap<EditActionType, Mixed<MidiRef>> = {
    draw: remove,
    select: (t) => {
      if (t.origin) return;

      if (t.fragmentId) {
        setCurrent(t.fragmentId);
      }

      select(t);
      openDropDown(t);
    }
  };

  const dragging = useDragging<MidiRef>({
    onSelect: selectIn,
    onMove: move,
    onScale: scale,
    onEnd: sync,
    onStart: mouseDownInactive[actionType],
    onBackground: onBackgroundHandler[actionType]
  });

  return (
    <g>
      <DragingBackground onMouseDown={dragging.onBackground} />
      {all.map((t, midiIndex) => (
        <Fragment
          key={midiIndex}
          y={t.trackId * trackHeight}
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
  const { count, length, newTrack, currentTrack, current, dispatch } =
    useTracks();
  const { options } = useMidiFragment();
  const timelineHeight = 32;
  const [actionType, setActionType] = React.useState<EditActionType>('select');
  const [opened, setOpen] = React.useState<MidiRef | undefined>(undefined);

  return (
    <div style={styles.container}>
      <section style={styles.header}>
        <div style={styles.bar}>
          <div>{current.name}</div>
          <NameInput
            value={current.name}
            onChange={(name) =>
              dispatch({
                type: 'TRACK/SET_TRACK',
                trackId: currentTrack,
                payload: { name }
              })
            }
          />
          <button onClick={newTrack}>New</button>
        </div>
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

        {opened && (
          <div style={styles.bar}>
            <DropDown
              id="tracks-midi-ref-fragment-selector"
              label="Fragment"
              value={opened.fragmentId ?? ''}
              options={options}
              onChange={(fragmentId) => {
                dispatch({
                  type: 'MIDI/SET_MIDI_REF',
                  payload: { id: opened.id, fragmentId }
                });
                setOpen(undefined);
              }}
            />
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
        <BpmEditor
          width={length + rulerSize}
          height={bpmHeight}
          panelWidth={panelWidth}
        />
      </section>
    </div>
  );
};
