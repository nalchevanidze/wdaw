import { useContext } from 'react';
import { DawApiContext } from '../../context/state';
import { noteFromKeyboard } from '../utils/keyboard';
import { KEY_EVENT_TYPE, useKeyEvent } from '../../hooks/use-key-event';

type KeyHandler = (e: KeyboardEvent | number) => void;

export const useKeyboard = () => {
  const { notes, dispatch } = useContext(DawApiContext);

  const handler =
    (type: KEY_EVENT_TYPE): KeyHandler =>
    (e) => {
      const key = noteFromKeyboard(e);
      if (key) {
        dispatch({ type, payload: key });
      }
    };

  useKeyEvent(handler);

  const onKeyDown = handler('KEYBOARD/KEY_DOWN');

  const onKeyUp = handler('KEYBOARD/KEY_UP');

  return { notes, onKeyDown, onKeyUp };
};
