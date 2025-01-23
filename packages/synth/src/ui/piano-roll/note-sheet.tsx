import * as React from 'react';
import { Timeline } from './timeline';
import { Notes } from './notes';
import {
  genNoteAt,
  Selected,
  selectNotesIn,
  KEYBOARD_WIDTH,
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
import { NOTE_SIZE, TIMELINE_HEIGHT } from '../common/defs';
import { MEvent, MODE, useDragging } from '../hooks/useDragging';
import { useNotes } from '../hooks/useNotes';

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

type Props = {
  actionType: EditActionType;
};

const NoteSheet: React.FC<Props> = ({ actionType }) => {
  const [
    {
      player: { time },
      tracks: { currentTrack, tracks }
    }
  ] = useContext(ConfiguratorContext);
  const getCoordinates = React.useContext(StageContext);

  const [selectionArea, setSelectionArea] = useState<SelectZone | undefined>();
  const { startDragging, endDragging, onMouseMove } = useDragging({
    onMouseMove: (mode, point, dragging) => {
      switch (mode) {
        case 'SELECT': {
          const area = dragging ? ([dragging, point] as const) : undefined;
          setSelectionArea(area);
          return updateNotes(selectNotesIn(notes, area));
        }
        case 'MOVE':
        case 'SCALE': {
          return dragging
            ? updateNotes({
                selected: editNotes(mode, notes.selected, dragging, point),
                inactive: notes.inactive
              })
            : undefined;
        }
      }
    },
    onEndDragging(mode) {
      if (mode && ['MOVE', 'RESIZE'].includes(mode)) {
        clearSelection();
      }
      setSelectionArea(undefined);
    }
  });
  const {
    notes,
    updateNotes,
    selectNote,
    clearSelection,
    removeNote,
    addNote
  } = useNotes();

  const clickOnBackground: MouseEventHandler<SVGGElement> = (e) => {
    switch (actionType) {
      case 'draw': {
        startDragging('SCALE', e);
        return addNote(genNoteAt(getCoordinates(e)));
      }
      case 'select':
        startDragging('SELECT', e);
        return clearSelection();
    }
  };

  const clickOnNote = (
    e: React.MouseEvent<SVGGElement, MouseEvent>,
    note: NotePoint
  ): void => {
    switch (actionType) {
      case 'draw': {
        return removeNote(note);
      }
      case 'select': {
        startDragging('MOVE', e);
        return selectNote(note);
      }
    }
  };

  const startDraggingSelected =
    (name: MODE) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
      startDragging(name, e);

      updateNotes({
        selected: notes.selected.map((note) => ({ ...note, old: { ...note } })),
        inactive: notes.inactive
      });
    };

  const deleteNotes = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace': {
        return updateNotes({ selected: [], inactive: notes.inactive });
      }
    }
  };

  useKeyAction(deleteNotes, [notes]);

  const track = tracks[currentTrack].midi;

  const loopSize = (track.loop[1] - track.loop[0]) * 8;

  const current =
    time < track.start * 8 ? 0 : track.loop[0] * 8 + (time % loopSize);

  return (
    <g
      onMouseMove={onMouseMove}
      onMouseLeave={endDragging}
      onMouseUp={endDragging}
    >
      <Background
        onMouseDown={clickOnBackground}
        loop={tracks[currentTrack].midi.loop}
      />
      <g>
        <Notes notes={notes.inactive} mouseDown={clickOnNote} />
        <Notes
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={startDraggingSelected('MOVE')}
          resize={startDraggingSelected('SCALE')}
        />
      </g>
      <Timeline time={(current * NOTE_SIZE) / 2} height={STAGE_HEIGHT} />
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
