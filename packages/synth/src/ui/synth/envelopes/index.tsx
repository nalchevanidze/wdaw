import * as React from 'react';
import EnvelopeGraphic from './envelope-graphic';
import { Panel } from '../panel';
import { colors } from '../../styles';
import { ENVELOPE_ID } from '../../../core/types';

const styles = {
  button: {
    fontSize: '11px',
    outline: 'none',
    background: 'none',
    border: 'none',
    width: '50%',
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  nav: {
    marginTop: '10px',
    width: '80%'
  }
} as const;

export interface ButtonProps {
  id: ENVELOPE_ID;
  active: ENVELOPE_ID;
  onClick: (input: ENVELOPE_ID) => void;
}

const Button = ({ id, active, onClick }: ButtonProps) => (
  <button
    style={{
      ...styles.button,
      color: colors.button(id === active)
    }}
    onClick={() => onClick(id)}
  >
    {id}
  </button>
);

const Envelopes: React.FC = () => {
  const [id, setId] = React.useState<ENVELOPE_ID>('gain');

  return (
    <Panel label="envelopes" size={3}>
      <div style={styles.nav}>
        <Button id="gain" active={id} onClick={setId} />
        <Button id="filter" active={id} onClick={setId} />
      </div>
      <EnvelopeGraphic id={id} />
    </Panel>
  );
};

export { Envelopes };
