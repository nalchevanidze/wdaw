import { EngineAction } from '../state/types';

export type EditActionType = 'select' | 'draw';

export type Maybe<T> = T | undefined;

export type MEvent = React.MouseEvent<SVGGElement, MouseEvent>;

export type MHandler = React.MouseEventHandler<SVGGElement>;

export type DawDispatch = React.Dispatch<EngineAction>;
