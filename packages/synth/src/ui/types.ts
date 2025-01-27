import { Point } from '@wdaw/svg';

export type Area = readonly [Point, Point];

export type EditActionType = 'select' | 'draw';

export type Maybe<T> = T | undefined;

export type MEvent = React.MouseEvent<SVGGElement, MouseEvent>

export type MHandler = React.MouseEventHandler<SVGGElement>;
