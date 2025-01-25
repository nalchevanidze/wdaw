import { OCTAVE_SIZE } from '../../utils/notes';
import { NOTE_SIZE, TIMELINE_HEIGHT } from '../common/defs';

export const CANVAS_HEIGHT = NOTE_SIZE * OCTAVE_SIZE * 4;

export const KEYBOARD_WIDTH = 20;

export const STAGE_HEIGHT = TIMELINE_HEIGHT + CANVAS_HEIGHT;