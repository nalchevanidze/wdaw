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
  border: '0.05em solid #BBB',
  alignItems: 'center',
  gap: '5px'
};

const bpmContainerStyle = {
  display: 'flex',
  padding: '5px',
  alignItems: 'center',
  fontFamily: 'sans-serif',
  fontSize: '14px',
};

const maxBPM = 200;
const minBPM = 1;

const Header: React.FC = () => {
  const [
    {
      player: { isPlaying },
      bpm
    },
    dispatch
  ] = useContext(ConfiguratorContext);

  const player = (payload: PLAYER_ACTION) =>
    dispatch({ type: 'PLAYER', payload });

  const setBPM = (value: string) => {
    dispatch({
      type: 'SET_BPM',
      payload: Math.min(Math.max(minBPM, Number(value)), maxBPM)
    });
  };

  return (
    <section style={containerStyle}>
      <HeaderButton
        id={isPlaying ? 'pause' : 'play'}
        onClick={() => player(isPlaying ? 'pause' : 'play')}
      />
      <HeaderButton id={'stop'} onClick={() => player('stop')} />
      <div style={bpmContainerStyle}>
        <label htmlFor="bpm-input">BPM</label>
        <input
          id="bpm-input"
          type="number"
          value={bpm}
          onChange={(x) => setBPM(x.target.value)}
          min={minBPM}
          max={maxBPM}
          style={{
            userSelect: 'none',
            outline: 'none',
            border: '0',
            background: colors.secondary,
            fontSize: '14px',
            marginLeft: '4px',
            borderRadius: '3px'
          }}
        />
      </div>
    </section>
  );
};

export { Header };
