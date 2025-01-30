import * as React from 'react';
import { UI } from './ui';
import { useEngine } from './ui/hooks/use-engine';
import { makeReducer } from './ui/reducer';
import { DawApiContext } from './ui/context/daw-state';

const Daw: React.FC = () => {
  const [state, dispatch] = useEngine(makeReducer);

  return (
    <DawApiContext.Provider value={[state, dispatch]}>
      <UI />
    </DawApiContext.Provider>
  );
};

export default Daw;
