import { useKeyEvent } from "../../hooks/use-key-event";

export const useOnDeleteKey = (f: () => void, args: unknown[] = []) => {
  const deleteNotes = () => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Backspace':
        return f();
    }
  };

  useKeyEvent(deleteNotes, args);
};
