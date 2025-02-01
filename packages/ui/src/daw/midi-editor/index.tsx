import * as React from 'react';
import { Point, SvgStage } from '@wdaw/svg';
import { OCTAVE_SIZE } from '@wdaw/engine';
import { NoteComposerHeader } from './header';
import { BLOCK, NOTE, QUARTER } from '../../common/units';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { EditActionType, MHandler } from '../types';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { useNoteEditor } from '../hooks/use-note-editor';
import { useTime } from '../hooks/use-time';
import { SelectionArea } from './selection-area';
import { UINote } from '../utils/notes';
import { Keyboard, Keys } from './keyboard';
import { Loop } from './loop';
import { LoopTarget, useLoop } from '../hooks/use-loop-editor';
import { useTrack } from '../hooks/use-track';
import { NoteGrid } from '../../components/note-grid';

type Props = {
  actionType: EditActionType;
};

const octaveCount = 4;
const timelineHeight = 16;
const keyboardWidth = 20;
const ocatveHeight = NOTE * OCTAVE_SIZE;
const canvasHeight = ocatveHeight * octaveCount;
const stageHeight = timelineHeight + canvasHeight;

const MidiEditorCanvas: React.FC<Props> = ({ actionType }) => {
  const { time, end } = useTime();
  const notes = useNoteEditor(canvasHeight);
  const loop = useLoop();

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
        patternHeight={ocatveHeight}
        height={ocatveHeight * octaveCount}
      >
        <Keys width={BLOCK} opacity={0.07} />
      </NoteGrid>
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
      <Loop
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
  const [track] = useTrack();
  const width = keyboardWidth + track.midi.loop[1] * QUARTER + BLOCK * 2;

  const viewBox = [-keyboardWidth, -timelineHeight, width, stageHeight].join(
    ' '
  );

  return (
    <>
      <NoteComposerHeader actionType={actionType} dispatch={setActionType} />
      <div style={{ width: '560px', overflow: 'scroll', height: '350px' }}>
        <SvgStage
          viewBox={viewBox}
          width={width + 'px'}
          height={stageHeight + 'px'}
          style={{ background: '#FFF' }}
        >
          <MidiEditorCanvas actionType={actionType} />
        </SvgStage>
      </div>
    </>
  );
};
