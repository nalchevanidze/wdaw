import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import { colors } from '../styles';

const Tracks: React.FC = () => {
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);

  return (
    <div style={{ width: '100%' }}>
      {tracks.tracks.map(({ midi }, i) => (
        <div
          style={{
            width: '100%',
            height: '40px',
            background: 'gray',
            margin: '1px'
          }}
        >
          <button
            key={i}
            style={{
              color: colors.button(i === tracks.currentTrack),
              width: '60px',
              height: '40px'
            }}
            onClick={() => dispatch({ type: 'SET_TRACK', payload: i })}
          >
            {midi.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export { Tracks };
