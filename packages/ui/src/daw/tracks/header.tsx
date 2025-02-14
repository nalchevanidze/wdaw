import * as React from 'react';
import { useContext } from 'react';
import { HeaderButton } from '../../components/header-button';
import { colors } from '../../styles';
import { DawApiContext } from '../../context/state';

const styles = {
  container: {
    display: 'flex',
    background: colors.background,
    padding: '5px',
    border: '0.05em solid #BBB',
    alignItems: 'center',
    gap: '5px'
  },
  bpm: {
    display: 'flex',
    padding: '5px',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    fontSize: '14px'
  },
  bpmInput: {
    userSelect: 'none',
    outline: 'none',
    border: '0',
    background: colors.secondary,
    fontSize: '14px',
    marginLeft: '4px',
    borderRadius: '3px'
  }
} as const;

const maxBPM = 200;
const minBPM = 0;

const Header: React.FC = () => {
  const [{ isPlaying, bpm }, dispatch] = useContext(DawApiContext);

  const setBPM = (value: string) => {
    dispatch({
      type: 'SET_BPM',
      payload: Math.min(Math.max(minBPM, Number(value)), maxBPM)
    });
  };

  return (
    <section style={styles.container}>
      <HeaderButton
        id={isPlaying ? 'pause' : 'play'}
        onClick={() => dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' })}
      />
      <HeaderButton id={'stop'} onClick={() => dispatch({ type: 'STOP' })} />
      <div style={styles.bpm}>
        <label htmlFor="bpm-input">BPM</label>
        <input
          id="bpm-input"
          type="number"
          value={bpm}
          onChange={(x) => setBPM(x.target.value)}
          min={minBPM}
          max={maxBPM}
          style={styles.bpmInput}
        />
      </div>
    </section>
  );
};

export { Header };
