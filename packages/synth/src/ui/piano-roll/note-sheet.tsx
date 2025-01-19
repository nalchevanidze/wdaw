import * as React from 'react';
import { Timeline } from './timeline';
import { Notes } from './notes';
import {
  insertNoteAt,
  flatten,
  deepen,
  Selected,
  selectNotesIn,
  NOTE_SIZE,
  KEYBOARD_WIDTH,
  TIMELINE_HEIGHT,
  editNotes,
  STAGE_WIDTH,
  STAGE_HEIGHT
} from './utils';
import { Background } from './background';
import { StageContext, SvgStage, Point } from '@wdaw/svg';
import { MouseEventHandler, useContext, useState } from 'react';
import { EditActionType, Maybe, NotePoint, SelectZone } from '../types';
import { ConfiguratorContext } from '../configurator';
import { useKeyAction } from '../utils';

const viewBox = [
  -KEYBOARD_WIDTH,
  -TIMELINE_HEIGHT,
  STAGE_WIDTH,
  STAGE_HEIGHT
].join(' ');

const SelectionCover: React.FC<SelectZone> = ([start, end]) => (
  <rect
    stroke="red"
    fill="red"
    fillOpacity={0.1}
    x={Math.min(start.x, end.x)}
    y={Math.min(start.y, end.y)}
    width={Math.abs(end.x - start.x)}
    height={Math.abs(end.y - start.y)}
  />
);

type MODE = 'SCALE' | 'MOVE' | 'SELECT';

type Props = {
  actionType: EditActionType;
};

const NoteSheet: React.FC<Props> = ({ actionType }) => {
  const [
    {
      player: { time },
      tracks: { currentTrack, tracks }
    },
    dispatch
  ] = useContext(ConfiguratorContext);
  const getCoordinates = React.useContext(StageContext);
  const refreshMidi = (ns: Selected<NotePoint>): void =>
    dispatch({
      type: 'SET_MIDI',
      payload: deepen([...ns.selected, ...ns.inactive])
    });

  const [mode, setMode] = React.useState<MODE | undefined>(undefined);
  const [selectionArea, setSelectionArea] = useState<SelectZone | undefined>();
  const [dragging, setDragging] = useState<Maybe<Point>>(undefined);

  const [notes, setNotes] = useState<Selected<NotePoint>>({
    selected: [],
    inactive: flatten(tracks[currentTrack].midi)
  });

  React.useEffect(() => {
    setNotes({
      selected: [],
      inactive: flatten(tracks[currentTrack].midi)
    });
  }, [tracks[currentTrack].midi]);

  const allNotes = [...notes.selected, ...notes.inactive];

  const onMouseMove: MouseEventHandler<SVGGElement> = (e) => {
    const point = getCoordinates(e);
    const { selected, inactive } = notes;

    switch (mode) {
      case 'SELECT': {
        const area = dragging ? ([dragging, point] as const) : undefined;
        setSelectionArea(area);
        return setNotes(selectNotesIn(notes, area));
      }
      case 'MOVE':
      case 'SCALE': {
        return dragging
          ? setNotes({
              selected: editNotes(mode, selected, dragging, point),
              inactive
            })
          : undefined;
      }
    }
  };

  const handleEventEnd = (): void => {
    if (mode && ['MOVE', 'RESIZE'].includes(mode)) {
      allNotes.forEach((x) => (x.old = undefined));
      const changes = { selected: [], inactive: allNotes };
      setNotes(changes);
      refreshMidi(changes);
    }
    setMode(undefined);
    setSelectionArea(undefined);
    setDragging(undefined);
  };

  const clickOnBackground: MouseEventHandler<SVGGElement> = (e) => {
    switch (actionType) {
      case 'draw': {
        const selection = insertNoteAt(notes, getCoordinates(e));
        startDragging('SCALE', e, selection);
        refreshMidi(selection);
        return;
      }
      case 'select':
        startDragging('SELECT', e, { selected: [], inactive: allNotes });
    }
  };

  const clickOnNote = (
    e: React.MouseEvent<SVGGElement, MouseEvent>,
    note: NotePoint
  ): void => {
    switch (actionType) {
      case 'draw': {
        // delete notes
        const changes = {
          selected: [],
          inactive: allNotes.filter((arrayNote) => arrayNote !== note)
        };
        refreshMidi(changes);
        return setNotes(changes);
      }
      case 'select': {
        return startDragging('MOVE', e, {
          selected: [note],
          inactive: allNotes.filter((e) => e !== note)
        });
      }
    }
  };

  const startDragging = (
    name: MODE,
    e: React.MouseEvent<SVGGElement, MouseEvent>,
    { selected, inactive }: Selected<NotePoint> = notes
  ) => {
    setMode(name);
    setDragging(getCoordinates(e));
    setNotes({
      selected: selected.map((note) => ({ ...note, old: { ...note } })),
      inactive
    });
  };

  const deleteNotes = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace': {
        const changes = { selected: [], inactive: notes.inactive };
        setNotes(changes);
        return refreshMidi(changes);
      }
      case 'Enter':
        console.log(JSON.stringify(deepen(allNotes)));
    }
  };

  useKeyAction(deleteNotes, [notes]);

  return (
    <g
      onMouseMove={onMouseMove}
      onMouseLeave={handleEventEnd}
      onMouseUp={handleEventEnd}
      onKeyDown={(x) => console.log('DOWN', x)}
    >
      <Background onMouseDown={clickOnBackground} />
      <g>
        <Notes notes={notes.inactive} mouseDown={clickOnNote} />
        <Notes
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={(e) => startDragging('MOVE', e)}
          resize={(e) => startDragging('SCALE', e)}
        />
      </g>
      <Timeline
        time={(time * NOTE_SIZE) / 2}
        height={STAGE_HEIGHT}
        width={STAGE_WIDTH}
        setTime={(payload) => dispatch({ type: 'SET_TIME', payload })}
      />
      {selectionArea ? <SelectionCover {...selectionArea} /> : null}
    </g>
  );
};

const PianoRoll: React.FC<Props> = (props) => (
  <SvgStage
    viewBox={viewBox}
    width={STAGE_WIDTH + 'px'}
    height={STAGE_HEIGHT + 'px'}
    style={{
      background: '#FFF'
    }}
  >
    <NoteSheet {...props} />
  </SvgStage>
);

export default PianoRoll;
