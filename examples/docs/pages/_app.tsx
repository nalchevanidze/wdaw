import { AppProps } from 'next/app';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div style={{ width: '100%' }}>
    <div
      style={{
        maxWidth: 1260,
        margin: '0 auto',
        padding: '3rem'
      }}
    >
      <Component {...pageProps} />
    </div>
  </div>
);

export default App;
