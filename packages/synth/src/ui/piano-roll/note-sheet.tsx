import * as React from 'react';
import { Point, SvgStage } from '@wdaw/svg';
import { BLOCK, NOTE, QUARTER } from '../common/units';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { Grid } from './grid';
import { EditActionType } from '../types';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { useNoteEditor } from '../hooks/use-note-editor';
import { useTime } from '../hooks/use-time';
import { SelectionArea } from './selection-area';
import { useTrack } from '../configurator';
import { UINote } from '../common/notes';
import { Keyboard } from './keyboard';
import { Loop } from './loop';
import { OCTAVE_SIZE } from '../../utils/notes';

type Props = {
  actionType: EditActionType;
};

const octaveCount = 4;
const timelineHeight = 16;
const keyboardWidth = 20;
const ocatveHeight = NOTE * OCTAVE_SIZE;
const canvasHeight = ocatveHeight * octaveCount;
const stageHeight = timelineHeight + canvasHeight;

const NoteSheet: React.FC<Props> = ({ actionType }) => {
  const { time, loop, end } = useTime();
  const notes = useNoteEditor(canvasHeight);

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
      <Grid ocatveHeight={ocatveHeight} count={octaveCount} />
      <Keyboard
        width={keyboardWidth}
        ocatveHeight={ocatveHeight}
        count={octaveCount}
      />
      <rect
        fillOpacity={0}
        width={end}
        height={canvasHeight}
        onMouseDown={dragging.onBackground}
      />
      <g>
        <Notes
          height={canvasHeight}
          notes={notes.inactive}
          mouseDown={dragging.onInactive}
        />
        <Notes
          height={canvasHeight}
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={dragging.onSelected('move')}
          scale={dragging.onSelected('scale')}
        />
      </g>
      <Timeline time={time} timeline={timelineHeight} height={stageHeight} />
      <Loop loop={loop} height={canvasHeight} />
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

const PianoRoll: React.FC<Props> = (props) => {
  const [track] = useTrack();
  const width = keyboardWidth + track.midi.loop[1] * QUARTER + BLOCK * 2;

  const viewBox = [-keyboardWidth, -timelineHeight, width, stageHeight].join(
    ' '
  );

  return (
    <SvgStage
      viewBox={viewBox}
      width={width + 'px'}
      height={stageHeight + 'px'}
      style={{
        background: '#FFF'
      }}
    >
      <NoteSheet {...props} />
    </SvgStage>
  );
};

export default PianoRoll;
