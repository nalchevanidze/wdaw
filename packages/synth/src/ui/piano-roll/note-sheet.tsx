import * as React from 'react';
import { Point, SvgStage } from '@wdaw/svg';
import { TIMELINE_HEIGHT } from '../common/defs';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { KEYBOARD_WIDTH, STAGE_WIDTH, STAGE_HEIGHT } from './utils';
import { Background } from './background';
import { EditActionType, NotePoint } from '../types';
import { HandlerMap, useDragging } from '../hooks/useDragging';
import { useNotes } from '../hooks/useNotes';
import { useTime } from '../hooks/use-time';
import { SelectionArea } from './selection-area';

type Props = {
  actionType: EditActionType;
};

const NoteSheet: React.FC<Props> = ({ actionType }) => {
  const { time, loop } = useTime();
  const notes = useNotes();

  const onBackgroundHandler: HandlerMap<EditActionType, Point> = {
    draw: (point) => {
      notes.addAt(point);
      return 'scale';
    },
    select: () => {
      notes.clear();
      return 'select';
    }
  };

  const mouseDownInactive: HandlerMap<EditActionType, NotePoint> = {
    draw: (note) => {
      notes.remove(note);
      return undefined;
    },
    select: (note) => {
      notes.select(note);
      return 'move';
    }
  };

  const dragging = useDragging({
    onMove: {
      select: notes.selectIn,
      move: (area) => (area ? notes.move(area) : undefined),
      scale: (area) => (area ? notes.scale(area) : undefined)
    },
    onBackground: onBackgroundHandler[actionType],
    onSelected: notes.track,
    onInactive: mouseDownInactive[actionType]
  });

  return (
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <Background onMouseDown={dragging.onBackground} loop={loop} />
      <g>
        <Notes notes={notes.inactive} mouseDown={dragging.onInactive} />
        <Notes
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={dragging.onSelected('move')}
          resize={dragging.onSelected('scale')}
        />
      </g>
      <Timeline time={time} height={STAGE_HEIGHT} />
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

const viewBox = [
  -KEYBOARD_WIDTH,
  -TIMELINE_HEIGHT,
  STAGE_WIDTH,
  STAGE_HEIGHT
].join(' ');

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
