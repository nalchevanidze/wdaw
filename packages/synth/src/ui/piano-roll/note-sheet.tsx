import * as React from 'react';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { KEYBOARD_WIDTH, STAGE_WIDTH, STAGE_HEIGHT } from './utils';
import { Background } from './background';
import { StageContext, SvgStage } from '@wdaw/svg';
import { useContext } from 'react';
import { EditActionType, NotePoint } from '../types';
import { ConfiguratorContext } from '../configurator';
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
      select: notes.selectIn,
      move: (area) => (area ? notes.move(area) : undefined),
      scale: (area) => (area ? notes.scale(area) : undefined)
    }
  });

  const mouseDownBackground = {
    draw: (e: MEvent) => {
      dragging.start('scale', e);
      notes.add(getCoordinates(e));
    },
    select: (e: MEvent) => {
      dragging.start('select', e);
      notes.clear();
    }
  };

  const mouseDownInactive = {
    draw: (_: MEvent, note: NotePoint) => notes.remove(note),
    select: (e: MEvent, note: NotePoint) => {
      dragging.start('move', e);
      notes.select(note);
    }
  };

  const mouseDownSelected =
    (name: MODE) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
      dragging.start(name, e);
      notes.track();
    };

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
        onMouseDown={mouseDownBackground[actionType]}
        loop={midi.loop}
      />
      <g>
        <Notes
          notes={notes.inactive}
          mouseDown={mouseDownInactive[actionType]}
        />
        <Notes
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={mouseDownSelected('move')}
          resize={mouseDownSelected('scale')}
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
