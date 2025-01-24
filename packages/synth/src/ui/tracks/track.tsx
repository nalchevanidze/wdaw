import * as React from 'react';
import { flatten } from '../piano-roll/utils';
import { SvgStage } from '@wdaw/svg';
import { Midi } from '../../engine';
import { colors } from '../styles';
import { ConfiguratorContext } from '../configurator';
import { BLOCK_SIZE, MidiLoop, STAGE_HEIGHT } from './midi-loop';
import { useDragging } from '../hooks/useDragging';

type Props = { midi: Midi; name: string; i: number };

export const PANEL = 50 as const;

export const STAGE_WIDTH = BLOCK_SIZE * 4;

export const WIDTH = STAGE_WIDTH + PANEL;

export const viewBox = [-PANEL, 0, WIDTH, STAGE_HEIGHT].join(' ');

const TrackNotes: React.FC<Props> = ({ midi, name, i }) => {
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);

  const dragging = useDragging({
    onMove: {
      select: () => {
        // notes.selectIn
      },
      move: (area) => {},
      scale: (area) => {}
    },
    onBackground: (point) => {
      // notes.addAt(point);
      return 'scale';
    },
    onInactive: (note) => {
      //notes.select(note);
      return 'move';
    }
  });

  const active = i === tracks.currentTrack;



  return (
    <>
      <text x={5 - PANEL} y={32} fill={active ? colors.notes : 'gray'}>
        {name}
      </text>
      <rect
        fill="black"
        opacity={active ? 0.03 : 0.1}
        y={0}
        x={-PANEL}
        width={PANEL}
        height={STAGE_HEIGHT}
        onClick={() => dispatch({ type: 'SET_TRACK', payload: i })}
        style={{ border: 'none', cursor: 'pointer' }}
      />
      <MidiLoop  midi={midi} name={name} />
    </>
  );
};

const Track: React.FC<Props> = (props) => (
  <SvgStage
    viewBox={viewBox}
    width={WIDTH}
    height={STAGE_HEIGHT}
    style={{ background: '#FFF', border: '1px solid #BBB', display: 'block' }}
  >
    <TrackNotes {...props} />
  </SvgStage>
);

export default Track;
