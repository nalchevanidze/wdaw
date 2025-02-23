import * as React from 'react';
import { EditActionType } from '../types';
import { colors } from '../../styles';
import { IconButton } from '../../components/icon-button';
import { DawApiContext } from '../../context/state';
import { TextInput } from '../../components/text-input';
import { DropDown } from '../../components/drop-down';
import { useMidiFragment } from '../hooks/use-midi-fragment';

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
  actionType: EditActionType;
  manu(x: EditActionType): void;
};

export const Header: React.FC<Props> = ({ actionType, manu }) => {
  const { name, id, options, dispatch } = useMidiFragment();

  return (
    <section style={styles.container}>
      <TextInput
        label="Rename"
        value={name}
        onChange={(name) =>
          dispatch({ type: 'SET_MIDI_FRAGMENT', id, payload: { name } })
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
      <DropDown
        label="Fragment"
        value={id}
        options={options}
        onChange={(payload) =>
          dispatch({ type: 'SET_CURRENT_FRAGMENT', payload })
        }
      />
    </section>
  );
};
