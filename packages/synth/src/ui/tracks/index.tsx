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
            width: '200px',
            height: '40px',
            margin: '1px',
            display: "flex",
            alignItems:"flex-start",
            border: "1px solid #DDD"
          }}
        >
          <button
            style={{
              color: colors.button(i === tracks.currentTrack),
              width: '50px',
              height: '40px',
              border: "none",
              borderRight: "1px solid gray"
            }}
            onClick={() => dispatch({ type: 'SET_TRACK', payload: i })}
          >
            {name}
          </button>
          <Track midi={midi} />
          <Track midi={midi} />
          <Track midi={midi} />
        </div>
      ))}
    </div>
  );
};

export { Tracks };
