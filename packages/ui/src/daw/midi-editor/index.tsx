import * as React from 'react';
import { Point, Svg } from '@wdaw/svg';
import { OCTAVE_SIZE } from '@wdaw/engine';
import { NoteComposerHeader } from './header';
import { BLOCK } from '../../common/units';
import { Timeline } from './timeline';
import { Notes } from './notes';
import { EditActionType, MHandler } from '../types';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { useNoteEditor } from '../hooks/use-note-editor';
import { useFragmentTime } from '../hooks/use-time';
import { SelectionArea } from '../../components/selection-area';
import { Keyboard } from './keyboard';
import { Loop } from './loop';
import { LoopTarget, useLoop } from '../hooks/use-loop-editor';
import { NoteGrid } from '../../components/note-grid';
import { Keys } from '../../components/keys';
import { toAccuracy } from '../utils/area';
import { UINote } from '../utils/notes';
import { normalizer } from './dimensions';
import { Tracked } from '../utils/tracking';
import { DragingBackground } from '../../components/background';
import { useMidiFragment } from '../hooks/use-midi-fragment';

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
const normalize = normalizer({ noteHeight, canvasHeight });

const MidiEditorCanvas: React.FC<Props> = ({ actionType, loopAccuracy }) => {
  const time = useFragmentTime();
  const notes = useNoteEditor();
  const loop = useLoop();

  const onBackgroundHandler: HandlerMap<EditActionType, Point> = {
    draw: (point) => {
      notes.addAt(normalize(point));
      return 'scale';
    },
    select: () => {
      notes.clear();
      return 'select';
    }
  };

  const mouseDownInactive: HandlerMap<EditActionType, UINote> = {
    draw: (note) => notes.remove(note),
    select: (note) => notes.select(note)
  };

  const dragging = useDragging<Tracked<UINote>>({
    onMove: {
      select: (area) => notes.selectIn(area ? area.map(normalize) : undefined),
      scale: notes.scale,
      move: (x, y) =>
        loop.target
          ? loop.move(toAccuracy(x, loopAccuracy))
          : notes.move(x, Math.round(y / noteHeight))
    },
    onBackground: onBackgroundHandler[actionType],
    onStart: (note) =>
      note.origin ? undefined : mouseDownInactive[actionType](note),
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
    <g>
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
      <DragingBackground onMouseDown={dragging.onBackground} />
      <g>
        <Notes
          noteHeight={noteHeight}
          height={canvasHeight}
          notes={notes.all as any}
          mouseDown={dragging.onStart('move')}
          scale={dragging.onStart('scale')}
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
  const [{ id, loop }] = useMidiFragment();

  return (
    <>
      <NoteComposerHeader
        label={id}
        actionType={actionType}
        dispatch={setActionType}
      />
      <div style={{ width: '560px', overflow: 'scroll', height: '330px' }}>
        <Svg
          width={loop[1] + rulerSize}
          height={canvasHeight}
          paddingLeft={keyboardWidth}
          paddingTop={timelineHeight}
          zoom={4}
          style={{ background: '#FFF' }}
        >
          <MidiEditorCanvas
            actionType={actionType}
            loopAccuracy={rulerSize / 8}
          />
        </Svg>
      </div>
    </>
  );
};
