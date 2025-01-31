import * as React from 'react';
import Player from '@wdaw/player';

export default function PlayerPage() {
  return (
    <Player
      width={500}
      height={500}
      src="https://nalchevanidze.com/assets/audio/david-alpha-black-hole"
    />
  );
}
