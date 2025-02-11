const BUFFER_SIZE = 2048;

export type SoundIterator = {
  next(): number;
};

class Processor {
  private context?: AudioContext;

  open = (process: SoundIterator) => {
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

    this.context = AC;
    this.context.resume();
  };

  close = () => {
    this.context?.close();
  };
}

type Callback = () => void;

const audioProcessor = (process: SoundIterator): Callback => {
  try {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    const processor = new Processor();

    const init = () => {
      processor.open(process);
      removeEventListeners();
    };

    const removeEventListeners = () => {
      document.removeEventListener('click', init);
      document.removeEventListener('keypress', init);
    };

    document.addEventListener('click', init);
    document.addEventListener('keypress', init);

    return () => {
      processor.close();
      removeEventListeners();
    };
  } catch (e) {
    console.error('could not create audio context: ', e);
    return () => undefined;
  }
};

export { audioProcessor };
