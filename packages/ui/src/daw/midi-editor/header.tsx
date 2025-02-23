import * as React from 'react';
import { EditActionType } from '../types';
import { colors } from '../../styles';
import { IconButton } from '../../components/icon-button';
import { DawApiContext } from '../../context/state';
import { TextInput } from '../../components/text-input';

const styles = {
  container: {
    display: 'flex',
    background: colors.background,
    padding: '2px',
    border: '0.05em solid #BBB',
    alignItems: 'center'
  },
  label: {
    margin: '0px 16px',
    fontSize: '16px',
    padding: '0 24px',
    borderLeft: '1px solid gray'
  }
};

type Props = {
  label: string;
  actionType: EditActionType;
  manu(x: EditActionType): void;
};

export const Header: React.FC<Props> = ({ label, actionType, manu }) => {
  const [{ midiFragments, currentFragment }, dispatch] =
    React.useContext(DawApiContext);

  const options = Object.keys(midiFragments);

  return (
    <section style={styles.container}>
      <TextInput
        label="Rename"
        value={label}
        onChange={(name) =>
          dispatch({
            type: 'SET_MIDI_FRAGMENT',
            id: currentFragment,
            payload: { name }
          })
        }
      />
      <IconButton
        id="draw"
        color={colors.button(actionType === 'draw')}
        onClick={() => manu('draw')}
      />
      <IconButton
        id="select"
        color={colors.button(actionType === 'select')}
        onClick={() => manu('select')}
      />
      <p style={styles.label}>{label}</p>
      <div>
        <label htmlFor="midi-fragment">Fragment</label>
        <select
          id="midi-fragment"
          name="fragments"
          value={label}
          onChange={({ target }) => {
            dispatch({
              type: 'SET_CURRENT_FRAGMENT',
              payload: target.value
            });
          }}
        >
          <option value={`fragment-${options.length}`}>create new</option>
          {options.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select>
      </div>
    </section>
  );
};
