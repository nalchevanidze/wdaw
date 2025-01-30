import * as React from 'react';
import { Header } from './header';
import { TrackList } from './track-list';

const styles = {
  container: {
    position: 'relative',
    background: '#FFF',
    border: '1px solid #BBB',
    display: 'block',
    borderRadius: '5px'
  }
} as const;

export const Tracks: React.FC = () => (
  <div style={styles.container}>
    <TrackList />
    <Header />
  </div>
);
