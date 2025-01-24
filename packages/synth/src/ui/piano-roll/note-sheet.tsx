import * as React from 'react';
import { Timeline } from './timeline';
import { Notes } from './notes';
import {
  genNoteAt,
  selectNotesIn,
  KEYBOARD_WIDTH,
  editNotes,
  STAGE_WIDTH,
  STAGE_HEIGHT
} from './utils';
import { Background } from './background';
import { StageContext, SvgStage, Point } from '@wdaw/svg';
import { useContext, useState } from 'react';
import { EditActionType, Maybe, NotePoint, Trajectory, Aera } from '../types';
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

const SelectionCover: React.FC<Aera> = ([start, end]) => (
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

  const [selectionArea, setSelectionArea] = useState<Aera | undefined>();
  const { startDragging, endDragging, onMouseMove } = useDragging({
    onMouseMove: (mode, currentPoint, startPoint) => {
      const points: Maybe<Trajectory> = startPoint
        ? [startPoint, currentPoint]
        : undefined;

      switch (mode) {
        case 'SELECT': {
          setSelectionArea(points);
          return updateNotes(selectNotesIn(notes, points));
        }
        case 'MOVE':
        case 'SCALE': {
          return points
            ? updateNotes({
                selected: editNotes(mode, notes.selected, points[0], points[1]),
                inactive: notes.inactive
              })
            : undefined;
        }
      }
    },
    onEndDragging: () => setSelectionArea(undefined)
  });

  const {
    notes,
    updateNotes,
    selectNote,
    clearSelection,
    removeNote,
    addNote,
    trackOrigin
  } = useNotes();

  const backgroundClickHandlers = {
    draw: (e: MEvent) => {
      startDragging('SCALE', e);
      addNote(genNoteAt(getCoordinates(e)));
    },
    select: (e: MEvent) => {
      startDragging('SELECT', e);
      return clearSelection();
    }
  };

  const clickOnNoteHanlers = {
    draw: (_: MEvent, note: NotePoint) => removeNote(note),
    select: (e: MEvent, note: NotePoint) => {
      startDragging('MOVE', e);
      selectNote(note);
    }
  };

  const startDraggingSelected =
    (name: MODE) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
      startDragging(name, e);
      trackOrigin();
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
        onMouseDown={backgroundClickHandlers[actionType]}
        loop={tracks[currentTrack].midi.loop}
      />
      <g>
        <Notes
          notes={notes.inactive}
          mouseDown={clickOnNoteHanlers[actionType]}
        />
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
