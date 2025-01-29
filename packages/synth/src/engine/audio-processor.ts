const BUFFER_SIZE = 2048;

export type SoundIterator = {
  next(): number;
};

class Processor {
  AC?: AudioContext;

  create = (process: SoundIterator) => {
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

    this.AC = AC;
  };
}

type Callback = () => void;

const audioProcessor = (process: SoundIterator): Callback => {
  try {
    const processor = new Processor();

    const init = () => {
      processor.create(process);
      processor.AC?.resume();
      document.removeEventListener('click', init);
      document.removeEventListener('keypress', init);
    };

    document.addEventListener('click', init);
    document.addEventListener('keypress', init);

    return () => {
      processor.AC?.close();
      document.removeEventListener('click', init);
      document.removeEventListener('keypress', init);
    };
  } catch (e) {
    console.error('could not create audio context');
    return () => undefined;
  }
};

export { audioProcessor };
