import * as React from 'react';
import { Gui } from './daw';
import { useEngine } from './hooks/use-engine';
import { makeReducer } from './state';
import { DawApiContext } from './context/state';

const Daw: React.FC = () => {
  const [state, dispatch] = useEngine(makeReducer);

  return (
    <DawApiContext.Provider value={{ ...state, dispatch }}>
      <Gui />
    </DawApiContext.Provider>
  );
};

export default Daw;
