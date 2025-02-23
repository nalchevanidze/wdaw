import * as React from 'react';
import { EditActionType } from '../types';
import { colors } from '../../styles';
import { IconButton } from '../../components/icon-button';
import { DawApiContext } from '../../context/state';
import { NameInput } from '../../components/name-input';
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
  const { name, id, options, setFragment, setCurrent } = useMidiFragment();

  return (
    <section style={styles.container}>
      <NameInput
        value={name}
        onChange={(name) => setFragment({ name })}
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
        onChange={setCurrent}
      />
    </section>
  );
};
