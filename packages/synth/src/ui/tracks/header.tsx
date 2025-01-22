import * as React from 'react';
import { useContext } from 'react';
import HeaderButton from '../common/header-button';
import { ConfiguratorContext } from '../configurator';
import { colors } from '../styles';
import { PLAYER_ACTION } from '../../engine';

const containerStyle = {
  display: 'flex',
  background: colors.background,
  padding: '5px',
  border: '0.05em solid #BBB'
};
const Header: React.FC = () => {
  const [
    {
      player: { isPlaying }
    },
    action
  ] = useContext(ConfiguratorContext);

  const player = (payload: PLAYER_ACTION) =>
    action({ type: 'PLAYER', payload });

  return (
    <section style={containerStyle}>
      <HeaderButton
        id={isPlaying ? 'pause' : 'play'}
        onClick={() => player(isPlaying ? 'pause' : 'play')}
      />
      <HeaderButton id={'stop'} onClick={() => player('stop')} />
    </section>
  );
};

export { Header };
