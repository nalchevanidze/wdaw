import React from 'react';
import { createRoot } from 'react-dom/client';
import Synth from '@wdaw/ui';
import Player from '@wdaw/player';

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');

const root = document.getElementById('app');

if (root) {
  createRoot(root).render(
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
}
