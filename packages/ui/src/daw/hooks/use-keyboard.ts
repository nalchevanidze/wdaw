import { useContext, useState } from 'react';
import { DawApiContext } from '../../context/state';
import { noteFromKeyboard } from '../utils/keyboard';
import { useKeyEvent } from '../../hooks/use-key-event';

type KeyHandler = (e: KeyboardEvent | number) => void;

export const useKeyboard = () => {
  const { currentTrack, keyboard } = useContext(DawApiContext);
  const [notes, setNotes] = useState<number[]>([]);

  const onKeyDown: KeyHandler = (e) => {
    const key = noteFromKeyboard(e);
    if (key) {
      setNotes((ns) => [...ns, key]);
      keyboard.keyDown(currentTrack, key);
    }
  };

  const onKeyUp: KeyHandler = (e) => {
    const key = noteFromKeyboard(e);
    if (key) {
      keyboard.keyUp(currentTrack, key);
      setNotes((ns) => ns.filter((n) => n !== key));
    }
  };

  useKeyEvent({ down: onKeyDown, up: onKeyUp });

  return { notes, onKeyDown, onKeyUp };
};
