import * as React from 'react';
import { ConfiguratorContext } from '../configurator';

const Tracks: React.FC = () => {
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);

  return (
    <>
      {tracks.map(({ id }) => (
        <button
          key={id}
          onClick={() => dispatch({ type: 'SET_TRACK', payload: id })}
        >
          {id}
        </button>
      ))}
    </>
  );
};

export { Tracks };
