import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import Track from './track';

const Tracks: React.FC = () => {
  const [{ tracks }] = React.useContext(ConfiguratorContext);

  return (
    <div style={{ width: '100%' }}>
      {tracks.tracks.map(({ midi, name }, i) => (
        <Track midi={midi} i={i} name={name} key={i} />
      ))}
    </div>
  );
};

export { Tracks };
