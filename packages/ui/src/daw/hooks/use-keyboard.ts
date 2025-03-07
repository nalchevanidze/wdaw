import { useContext, useState } from 'react';
import { DawApiContext } from '../../context/state';
import { noteFromKeyboard } from '../utils/keyboard';
import { useKeyEvent } from '../../hooks/use-key-event';

type KeyHandler = (e: KeyboardEvent | number) => void;

export const useKeyboard = () => {
  const { currentTrack, engine } = useContext(DawApiContext);
  const [notes, setNotes] = useState<number[]>([]);

  const onKeyDown: KeyHandler = (e) => {
    const key = noteFromKeyboard(e);
    if (key) {
      setNotes((ns) => [...ns, key]);
      engine.startNote(currentTrack, key);
    }
  };

  const onKeyUp: KeyHandler = (e) => {
    const key = noteFromKeyboard(e);
    if (key) {
      engine.endNote(currentTrack, key);
      setNotes((ns) => ns.filter((n) => n !== key));
    }
  };

  useKeyEvent({ down: onKeyDown, up: onKeyUp }, [currentTrack, engine]);

  return { notes, onKeyDown, onKeyUp };
};
