import * as React from 'react';
import { EditActionType } from '../types';
import { colors } from '../../styles';
import HeaderButton from '../../components/header-button';

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
  dispatch(x: EditActionType): void;
};

const NoteComposerHeader: React.FC<Props> = ({
  label,
  actionType,
  dispatch
}) => {
  return (
    <section style={styles.container}>
      <HeaderButton
        id={'draw'}
        color={colors.button(actionType === 'draw')}
        onClick={() => dispatch('draw')}
      />
      <HeaderButton
        id={'select'}
        color={colors.button(actionType === 'select')}
        onClick={() => dispatch('select')}
      />
      <p style={styles.label}>{label}</p>
    </section>
  );
};

export { NoteComposerHeader };
