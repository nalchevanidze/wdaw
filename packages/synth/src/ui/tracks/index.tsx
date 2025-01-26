import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import Track from './track';
import { Header } from './header';
import { Timeline } from './timeline';
import { PANEL } from './defs';
import { NOTE, BLOCK } from '../common/defs';

const Tracks: React.FC = () => {
  const [{ tracks, player }] = React.useContext(ConfiguratorContext);
  const maxTrackSize = Math.max(...tracks.tracks.map((t) => t.midi.end));
  const width = maxTrackSize * NOTE + PANEL + BLOCK;
  const position = PANEL + player.time;

  return (
    <div style={{ position: 'relative' }}>
      <Header />
      <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
        <Timeline width={width} height={16} />
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
          <Track midi={midi} id={i} name={name} key={i} width={width} />
        ))}
      </div>
    </div>
  );
};

export { Tracks };
