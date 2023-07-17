import * as React from 'react';
import { useContext } from 'react';
import HeaderButton from './header-button';
import { EditActionType } from '../../types';
import { ConfiguratorContext } from '../../configurator';
import { colors } from '../../styles';
import { PLAYER_ACTION } from '../../../engine';

const containerStyle = {
  display: 'flex',
  background: colors.background,
  padding: '5px',
  border: '0.05em solid #BBB'
};

type Props = {
  actionType: EditActionType;
  dispatch(x: EditActionType): void;
};

const NoteComposerHeader: React.FC<Props> = ({ actionType, dispatch }) => {
  const [{ isPlaying }, action] = useContext(ConfiguratorContext);

  const player = (payload: PLAYER_ACTION) =>
    action({ type: 'PLAYER', payload });

  return (
    <section style={containerStyle}>
      <HeaderButton
        id={isPlaying ? 'pause' : 'play'}
        onClick={() => player(isPlaying ? 'pause' : 'play')}
      />
      <HeaderButton id={'stop'} onClick={() => player('stop')} />
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
    </section>
  );
};

export { NoteComposerHeader };
