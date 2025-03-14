import { TypedEvents } from './events';
import { ChangeEvents } from './types';

export type ITime = {
  get(): number;
};

export class Time {
  private current = 0;

  constructor(private events: TypedEvents<ChangeEvents>) {}

  public get = () => this.current;

  public set = (time: number) => {
    this.current = time;
    this.events.dispatch('changed/time', time);
  };
}
