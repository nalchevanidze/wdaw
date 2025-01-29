const BUFFER_SIZE = 2048;

export type SoundIterator = {
  next(): number;
};

const createContext = (process: SoundIterator) => {
  const AC = new AudioContext();
  const node = AC.createScriptProcessor(BUFFER_SIZE, 1, 1);
  node.connect(AC.destination);
  node.onaudioprocess = ({ outputBuffer }: AudioProcessingEvent): void => {
    const output = outputBuffer.getChannelData(0);
    const { length } = output;
    for (let i = 0; i < length; ++i) {
      output[i] = process.next();
    }
  };

  return AC;
};

type Callback = () => void;

const audioProcessor = (process: SoundIterator): Callback => {
  try {
    const AC = createContext(process);
    const init = () => {
      AC.resume();
      document.removeEventListener('click', init);
      document.removeEventListener('keypress', init);
    };

    document.addEventListener('click', init);
    document.addEventListener('keypress', init);

    return () => {
      AC.close();
      document.removeEventListener('click', init);
      document.removeEventListener('keypress', init);
    };
  } catch (e) {
    console.error('could not create audio context');
    return () => undefined;
  }
};

export { audioProcessor };
