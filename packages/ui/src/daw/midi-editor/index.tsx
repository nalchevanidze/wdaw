import * as React from 'react';
import { Point, Svg } from '@wdaw/svg';
import { OCTAVE_SIZE } from '@wdaw/engine';
import { Header } from './header';
import { BLOCK } from '../../common/units';
import { Notes } from './notes';
import { EditActionType, MHandler } from '../types';
import { HandlerMap, useDragging } from '../hooks/use-dragging';
import { useNoteEditor } from '../hooks/use-note-editor';
import { SelectionArea } from '../../components/selection-area';
import { Keyboard } from './keyboard';
import { Loop } from './loop';
import { LoopTarget, useLoop } from '../hooks/use-loop-editor';
import { NoteGrid } from '../../components/note-grid';
import { Keys } from '../../components/keys';
import { toAccuracy } from '../utils/area';
import { UINote } from '../utils/notes';
import { Mixed } from '../utils/tracking';
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

const MidiEditorCanvas: React.FC<Props> = ({ actionType, loopAccuracy }) => {
  const notes = useNoteEditor({
    accuracyX: Math.floor,
    accuracyY: Math.round,
    scaleX: (x) => x,
    scaleY: (y) => y / noteHeight,
    size: OCTAVE_SIZE * octaveCount
  });

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

  const mouseDownInactive: HandlerMap<EditActionType, Mixed<UINote>> = {
    draw: (note) => notes.remove(note),
    select: (note) => (note.origin ? undefined : notes.select(note))
  };

  const dragging = useDragging<Mixed<UINote>>({
    onMove: {
      select: notes.selectIn,
      scale: notes.scale,
      move: (x, y) =>
        loop.target ? loop.move(toAccuracy(loopAccuracy)(x)) : notes.move(x, y)
    },
    onBackground: onBackgroundHandler[actionType],
    onStart: mouseDownInactive[actionType],
    onEnd: () => (loop.target ? loop.endMove() : notes.sync())
  });

  const startLoopDragging =
    (target: LoopTarget): MHandler =>
    (e) => {
      loop.startMove(target);
      dragging.onElement('move')(e);
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
      <Notes
        noteHeight={noteHeight}
        height={canvasHeight}
        notes={notes.all as any}
        mouseDown={dragging.onElement('move')}
        scale={dragging.onElement('scale')}
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
  const { loop } = useMidiFragment();

  return (
    <>
      <Header actionType={actionType} manu={setActionType} />
      <div style={{ overflow: 'scroll', height: '330px' }}>
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
