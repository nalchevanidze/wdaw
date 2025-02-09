import * as React from 'react';
import { colors } from '../../styles';
import { Midi } from '@wdaw/engine';
import { UINote } from '../utils/notes';
import { fromMidiFragment } from '../utils/midi';
import { MEvent } from '../types';
import { DawApiContext } from '../../context/state';

type Props = {
  start: number;
  end: number;
  fragmentId: string;
  y: number;
  height: number;
  startMove?(event: MEvent): void;
  startScale?(event: MEvent): void;
  color: string;
};

const MidiLoop: React.FC<Props> = ({
  fragmentId,
  start,
  end,
  startMove,
  startScale,
  y,
  color,
  height
}) => {
  const [{ midiFragments }] = React.useContext(DawApiContext);

  const fragment = midiFragments[fragmentId];

  const notes = React.useMemo<UINote[]>(
    () => fromMidiFragment(fragment),
    [fragment]
  );
  const [loopStart, loopEnd] = fragment.loop;
  const id = React.useId();

  const loopWidth = loopEnd - loopStart;
  const midiWith = end - start;
  const containerEnd = start + midiWith;
  const scaleWidth = 5;
  const loopOffset = start % loopWidth;

  return (
    <g>
      <defs>
        <pattern
          width={loopWidth}
          height={height}
          patternUnits="userSpaceOnUse"
          id={id}
          x={loopOffset}
        >
          <g fill={colors.notes}>
            {notes.map((note, noteIndex) => (
              <rect
                key={noteIndex}
                width={note.length}
                height={1}
                x={note.x - loopStart}
                y={height - note.y}
              />
            ))}
          </g>
          <rect fill={color} opacity={0.4} width="100%" height="100%" />
        </pattern>
      </defs>
      <rect
        y={y}
        onMouseDown={(event) => startMove?.(event)}
        x={start}
        width={midiWith}
        height={height}
        fill={'url(#' + id + ')'}
        stroke={colors.notesBackground}
        strokeWidth={0.3}
      />
      <rect
        x={containerEnd - scaleWidth}
        y={y}
        width={scaleWidth}
        height={height}
        fill={'gray'}
        fillOpacity={0.05}
        onMouseDown={(event) => startScale?.(event)}
        style={{ cursor: 'e-resize' }}
      />
    </g>
  );
};

export { MidiLoop };
