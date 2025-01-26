import { OCTAVE_SIZE } from '../../utils/notes';
import { NOTE } from '../common/units';

export const KEYBOARD_WIDTH = 20;

export const TIMELINE_HEIGHT = 16;

export const CANVAS_HEIGHT = NOTE * OCTAVE_SIZE * 4;

export const STAGE_HEIGHT = TIMELINE_HEIGHT + CANVAS_HEIGHT;
