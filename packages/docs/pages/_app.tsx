import { AppProps } from 'next/app';

const styles = {
  container: {
    maxWidth: 1260,
    margin: '0 auto',
    padding: '3rem'
  }
};
const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div style={styles.container}>
    <Component {...pageProps} />
  </div>
);

export default App;
