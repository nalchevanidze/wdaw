import * as React from 'react';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { KEYBOARD_WIDTH, STAGE_WIDTH, STAGE_HEIGHT } from './utils';
import { Background } from './background';
import { StageContext, SvgStage } from '@wdaw/svg';
import { useContext } from 'react';
import { EditActionType, NotePoint } from '../types';
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
  const [{ player, tracks }] = useContext(ConfiguratorContext);
  const getCoordinates = React.useContext(StageContext);
  const notes = useNotes();
  const dragging = useDragging({
    onMove: {
      SELECT: notes.selectIn,
      MOVE: (area) => (area ? notes.move(area) : undefined),
      SCALE: (area) => (area ? notes.scale(area) : undefined)
    }
  });

  const backgroundClickHandlers = {
    draw: (e: MEvent) => {
      dragging.start('SCALE', e);
      notes.add(getCoordinates(e));
    },
    select: (e: MEvent) => {
      dragging.start('SELECT', e);
      notes.clear();
    }
  };

  const noteClickHanlers = {
    draw: (_: MEvent, note: NotePoint) => notes.remove(note),
    select: (e: MEvent, note: NotePoint) => {
      dragging.start('MOVE', e);
      notes.select(note);
    }
  };

  const startDragging =
    (name: MODE) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
      dragging.start(name, e);
      notes.track();
    };

  const deleteNotes = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace':
        return notes.removeSelected();
    }
  };

  useKeyAction(deleteNotes, [notes.selected, notes.inactive]);

  const midi = tracks.tracks[tracks.currentTrack].midi;
  const loopSize = (midi.loop[1] - midi.loop[0]) * 8;
  const time =
    ((player.time < midi.start * 8
      ? 0
      : midi.loop[0] * 8 + (player.time % loopSize)) *
      NOTE_SIZE) /
    2;

  return (
    <g
      onMouseMove={dragging.onMouseMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <Background
        onMouseDown={backgroundClickHandlers[actionType]}
        loop={midi.loop}
      />
      <g>
        <Notes
          notes={notes.inactive}
          mouseDown={noteClickHanlers[actionType]}
        />
        <Notes
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={startDragging('MOVE')}
          resize={startDragging('SCALE')}
        />
      </g>
      <Timeline time={time} height={STAGE_HEIGHT} />
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
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
