import '../styles/globals.css';
import { AppProps } from 'next/app';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div
    style={{
      width: '100%',
      background: 'rgb(215 239 253 / 65%)'
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '2em',
        maxWidth: 1260,
        margin: '0 auto',
        padding: '8rem 2rem',
        background: 'rgb(243 251 255 / 81%)',
        border: '2px solid white',
        borderRadius: 5
      }}
    >
      <div style={{ gridColumn: '3 / 13' }}>
        <Component {...pageProps} />
      </div>
    </div>
  </div>
);

export default App;
