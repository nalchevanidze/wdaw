import * as React from 'react';
import { Header } from './header';
import { TrackList } from './track-list';

export const Tracks: React.FC = () => (
  <div style={{ position: 'relative' }}>
    <Header />
    <TrackList />
  </div>
);
