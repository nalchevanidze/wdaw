import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import { colors } from '../styles';
import Track from './track';

const Tracks: React.FC = () => {
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);

  return (
    <div style={{ width: '100%' }}>
      {tracks.tracks.map(({ midi, name }, i) => (
        <div
          key={i}
          style={{
            width: '100%',
            height: '40px',
            background: 'gray',
            margin: '1px',
            display: "flex",
            alignItems:"flex-start"
          }}
        >
          <button
            style={{
              color: colors.button(i === tracks.currentTrack),
              width: '60px',
              height: '40px'
            }}
            onClick={() => dispatch({ type: 'SET_TRACK', payload: i })}
          >
            {name}
          </button>
          <Track midi={midi} />
        </div>
      ))}
    </div>
  );
};

export { Tracks };
