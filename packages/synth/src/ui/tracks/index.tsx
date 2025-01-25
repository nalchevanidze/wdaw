import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import Track, { PANEL } from './track';
import { Header } from './header';
import { Timeline } from './timeline';

const Tracks: React.FC = () => {
  const [{ tracks, player }] = React.useContext(ConfiguratorContext);
  
  const position = PANEL + player.time;

  return (
    <>
      <Header />
      <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
        <Timeline />
        <div
          style={{
            position: 'absolute',
            width: '2px',
            top: '0',
            bottom: '0',
            left: `${position}px`,
            background: 'red'
          }}
        />
        {tracks.tracks.map(({ midi, name }, i) => (
          <Track midi={midi} i={i} name={name} key={i} />
        ))}
      </div>
    </>
  );
};

export { Tracks };
