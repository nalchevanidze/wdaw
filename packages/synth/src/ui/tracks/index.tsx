import * as React from 'react';
import { ConfiguratorContext } from '../configurator';
import { colors } from '../styles';

const Tracks: React.FC = () => {
  const [{ tracks }, dispatch] = React.useContext(ConfiguratorContext);

  return (
    <div style={{ width: '100%' }}>
      {tracks.map(({ id, active,name }) => (
        <div style={{ width: '100%', height: "40px" , background: "gray", margin: "1px"}}>
          <button
            key={id}
            style={{ color: colors.button(active), width: '60px' ,height: "40px" }}
            onClick={() => dispatch({ type: 'SET_TRACK', payload: id })}
          >
            {name}
          </button>
        </div>
      ))}
    </div>
  );
};

export { Tracks };
