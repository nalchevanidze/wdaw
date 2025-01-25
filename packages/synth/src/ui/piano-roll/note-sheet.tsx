import * as React from 'react';
import { Point, SvgStage } from '@wdaw/svg';
import { QUARTER, SUB_QUARTER, TIMELINE_HEIGHT } from '../common/defs';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { KEYBOARD_WIDTH, STAGE_HEIGHT } from './utils';
import { Background } from './background';
import { EditActionType } from '../types';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { useNoteEditor } from '../hooks/use-note-editor';
import { useTime } from '../hooks/use-time';
import { SelectionArea } from './selection-area';
import { useTrack } from '../configurator';
import { UINote } from '../common/notes';

type Props = {
  actionType: EditActionType;
};

const NoteSheet: React.FC<Props> = ({ actionType }) => {
  const { time, loop, end } = useTime();
  const notes = useNoteEditor();

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

  const mouseDownInactive: HandlerMap<EditActionType, UINote> = {
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
    onInactive: mouseDownInactive[actionType],
    onEnd: (mode) => (mode !== 'select' ? notes.sync() : undefined)
  });

  return (
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <Background onMouseDown={dragging.onBackground} loop={loop} width={end} />
      <g>
        <Notes notes={notes.inactive} mouseDown={dragging.onInactive} />
        <Notes
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={dragging.onSelected('move')}
          scale={dragging.onSelected('scale')}
        />
      </g>
      <Timeline time={time} height={STAGE_HEIGHT} />
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

const PianoRoll: React.FC<Props> = (props) => {
  const [track] = useTrack();
  const width = KEYBOARD_WIDTH + track.midi.loop[1] * SUB_QUARTER + QUARTER * 2;

  const viewBox = [-KEYBOARD_WIDTH, -TIMELINE_HEIGHT, width, STAGE_HEIGHT].join(
    ' '
  );

  return (
    <SvgStage
      viewBox={viewBox}
      width={width + 'px'}
      height={STAGE_HEIGHT + 'px'}
      style={{
        background: '#FFF'
      }}
    >
      <NoteSheet {...props} />
    </SvgStage>
  );
};

export default PianoRoll;
