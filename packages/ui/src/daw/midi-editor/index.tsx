import * as React from 'react';
import { Point, SvgStage } from '@wdaw/svg';
import { OCTAVE_SIZE } from '@wdaw/engine';
import { NoteComposerHeader } from './header';
import { BLOCK } from '../../common/units';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { EditActionType, MHandler } from '../types';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { useNoteEditor } from '../hooks/use-note-editor';
import { useTime } from '../hooks/use-time';
import { SelectionArea } from './selection-area';
import { UINote } from '../utils/notes';
import { Keyboard } from './keyboard';
import { Loop } from './loop';
import { LoopTarget, useLoop } from '../hooks/use-loop-editor';
import { useTrack } from '../hooks/use-track';
import { NoteGrid } from '../../components/note-grid';
import { Keys } from '../../components/keys';

type Props = {
  actionType: EditActionType;
  loopAccuracy: number;
};

const noteHeight = 2;
const octaveCount = 4;
const timelineHeight = 8;
const keyboardWidth = 20;
const ocatveHeight = noteHeight * OCTAVE_SIZE;
const canvasHeight = ocatveHeight * octaveCount;
const rulerSize = BLOCK;

const MidiEditorCanvas: React.FC<Props> = ({ actionType, loopAccuracy }) => {
  const { time, end } = useTime();
  const notes = useNoteEditor({ noteHeight, canvasHeight });
  const loop = useLoop(loopAccuracy);

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
      move: (area) => {
        if (!area) return;

        return loop.target ? loop.move(area) : notes.move(area);
      },
      scale: (area) => (area ? notes.scale(area) : undefined)
    },
    onBackground: onBackgroundHandler[actionType],
    onSelected: notes.track,
    onInactive: mouseDownInactive[actionType],
    onEnd: (mode) => {
      if (loop.target) {
        return loop.endMove();
      }

      return mode !== 'select' ? notes.sync() : undefined;
    }
  });

  const startLoopDragging =
    (target: LoopTarget): MHandler =>
    (e) => {
      loop.startMove(target);
      dragging.start('move', e);
    };

  return (
    <g
      onMouseMove={dragging.onMove}
      onMouseLeave={dragging.end}
      onMouseUp={dragging.end}
    >
      <NoteGrid
        size={rulerSize}
        patternHeight={ocatveHeight}
        height={ocatveHeight * octaveCount}
      >
        <Keys opacity={0.07} height={noteHeight} />
      </NoteGrid>
      <Keyboard
        width={keyboardWidth}
        ocatveHeight={ocatveHeight}
        count={octaveCount}
        noteHeight={noteHeight}
      />
      <rect
        fillOpacity={0}
        width={end}
        height={canvasHeight}
        onMouseDown={dragging.onBackground}
      />
      <g>
        <Notes
          noteHeight={noteHeight}
          height={canvasHeight}
          notes={notes.inactive}
          mouseDown={dragging.onInactive}
        />
        <Notes
          noteHeight={noteHeight}
          height={canvasHeight}
          notes={notes.selected}
          color="#03A9F4"
          mouseDown={dragging.onSelected('move')}
          scale={dragging.onSelected('scale')}
        />
      </g>
      <Timeline
        size={rulerSize}
        time={time}
        timeline={timelineHeight}
        height={timelineHeight + canvasHeight}
      />
      <Loop
        controlerWidth={4}
        timelineHeight={timelineHeight}
        loop={loop.state}
        height={canvasHeight}
        moveStart={startLoopDragging('start')}
        moveEnd={startLoopDragging('end')}
      />
      {dragging.area ? <SelectionArea area={dragging.area} /> : null}
    </g>
  );
};

export const MidiEditor: React.FC = () => {
  const [actionType, setActionType] = React.useState<EditActionType>('select');
  const [
    {
      midi: {
        loop: [_, loopEnd]
      }
    }
  ] = useTrack();

  return (
    <>
      <NoteComposerHeader actionType={actionType} dispatch={setActionType} />
      <div style={{ width: '560px', overflow: 'scroll', height: '350px' }}>
        <SvgStage
          width={loopEnd + rulerSize}
          height={canvasHeight}
          style={{ background: '#FFF' }}
          shift={{ x: keyboardWidth, y: timelineHeight }}
          zoom={4}
        >
          <MidiEditorCanvas
            actionType={actionType}
            loopAccuracy={rulerSize / 8}
          />
        </SvgStage>
      </div>
    </>
  );
};
