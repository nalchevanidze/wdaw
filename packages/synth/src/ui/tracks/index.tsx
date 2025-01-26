import * as React from 'react';
import { Header } from './header';
import { TrackList } from './track-list';

export const Tracks: React.FC = () => (
  <div
    style={{
      position: 'relative',
      background: '#FFF',
      border: '1px solid #BBB',
      display: 'block',
      borderRadius: '5px'
    }}
  >
    <Header />
    <TrackList />
  </div>
);
