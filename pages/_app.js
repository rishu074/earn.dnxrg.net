import '../styles/globals.css'
import { useEffect, useState } from 'react';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setPageLoaded(true);
  }, [])

  return (
    <>
      <NextNProgress />
      {pageLoaded ? <Component {...pageProps} /> : null}
    </>
  )
}

export default MyApp
