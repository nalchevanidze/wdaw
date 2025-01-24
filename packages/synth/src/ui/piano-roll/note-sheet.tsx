import * as React from 'react';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { genNoteAt, KEYBOARD_WIDTH, STAGE_WIDTH, STAGE_HEIGHT } from './utils';
import { Background } from './background';
import { StageContext, SvgStage } from '@wdaw/svg';
import { useContext } from 'react';
import { EditActionType, NotePoint, Area } from '../types';
import { ConfiguratorContext } from '../configurator';
import { useKeyAction } from '../utils';
import { NOTE_SIZE, TIMELINE_HEIGHT } from '../common/defs';
import { MEvent, MODE, useDragging } from '../hooks/useDragging';
import { useNotes } from '../hooks/useNotes';
import { SelectionArea } from './selection-area';

const viewBox = [
  -KEYBOARD_WIDTH,
  -TIMELINE_HEIGHT,
  STAGE_WIDTH,
  STAGE_HEIGHT
].join(' ');

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

  const { selectionArea, startDragging, endDragging, onMouseMove } =
    useDragging({
      onMouseMove: (mode, area) => {
        switch (mode) {
          case 'SELECT':
            return notes.selectIn(area);
          case 'MOVE':
          case 'SCALE':
            return area ? notes.edit(mode, area) : undefined;
        }
      }
    });

  const notes = useNotes();

  const backgroundClickHandlers = {
    draw: (e: MEvent) => {
      startDragging('SCALE', e);
      notes.add(genNoteAt(getCoordinates(e)));
    },
    select: (e: MEvent) => {
      startDragging('SELECT', e);
      return notes.clearSelection();
    }
  };

  const clickOnNoteHanlers = {
    draw: (_: MEvent, note: NotePoint) => notes.remove(note),
    select: (e: MEvent, note: NotePoint) => {
      startDragging('MOVE', e);
      notes.select(note);
    }
  };

  const startDraggingSelected =
    (name: MODE) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
      startDragging(name, e);
      notes.track();
    };

  const deleteNotes = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace':
        return notes.removeSelected();
    }
  };

  useKeyAction(deleteNotes, [notes.selected, notes.inactive]);

  const midi = tracks[currentTrack].midi;
  const loopSize = (midi.loop[1] - midi.loop[0]) * 8;
  const current =
    ((time < midi.start * 8 ? 0 : midi.loop[0] * 8 + (time % loopSize)) *
      NOTE_SIZE) /
    2;

  return (
    <g
      onMouseMove={onMouseMove}
      onMouseLeave={endDragging}
      onMouseUp={endDragging}
    >
      <Background
        onMouseDown={backgroundClickHandlers[actionType]}
        loop={midi.loop}
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
      <Timeline time={current} height={STAGE_HEIGHT} />
      {selectionArea ? <SelectionArea area={selectionArea} /> : null}
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
