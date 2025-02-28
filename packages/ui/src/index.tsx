import * as React from 'react';
import { Gui } from './daw';
import { useEngine } from './hooks/use-engine';
import { makeReducer } from './state';
import { DawApiContext } from './context/state';

const Daw: React.FC = () => {
  const state = useEngine(makeReducer);

  return (
    <DawApiContext.Provider value={state}>
      <Gui />
    </DawApiContext.Provider>
  );
};

export default Daw;
