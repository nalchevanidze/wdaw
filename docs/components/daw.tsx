'use client'

import * as React from 'react';
import Synth from '@wdaw/synth';
import Player from '@wdaw/player';

type Props = {
  type: string;
};

const Daw: React.FC<Props> = ({ type }) => (
  <div>
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px'
      }}
    >
      <a href="/?type=player">player</a>
      <a href="/?type=synth">synth</a>
    </nav>
    <div>
      {type === 'player' ? (
        <Player
          width={500}
          height={500}
          src="https://nalchevanidze.com/assets/audio/david-alpha-black-hole"
        />
      ) : (
        <Synth />
      )}
    </div>
  </div>
);

export { Daw };
