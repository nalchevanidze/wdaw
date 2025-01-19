import * as React from 'react';
import NoteSheet from './note-sheet';
import { NoteComposerHeader } from './header';
import { EditActionType } from '../types';

const PianoRoll: React.FC = () => {
  const [actionType, setActionType] = React.useState<EditActionType>('select');

  return (
    <>
      <NoteComposerHeader actionType={actionType} dispatch={setActionType} />
      <div style={{ width: '560px', overflow: 'scroll', height: '320px' }}>
        <NoteSheet actionType={actionType} />
      </div>
    </>
  );
};

export { PianoRoll };
