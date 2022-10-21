import '../styles/globals.css'
import { useEffect, useState } from 'react';
import NextNProgress from 'nextjs-progressbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setPageLoaded(true);
  }, [])

  return (
    <>
      <Head>
        {/* seo  */}
        <meta name="title" content={process.env.NEXT_PUBLIC_META_TITLE} />
        <meta name="description" content={process.env.NEXT_PUBLIC_META_DESCRIPTION} />

        {/* Facebook  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_META_LINK} />
        <meta property="og:title" content={process.env.NEXT_PUBLIC_META_TITLE} />
        <meta property="og:description" content={process.env.NEXT_PUBLIC_META_DESCRIPTION} />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_META_IMAGE} />

        {/* Twitter  */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={process.env.NEXT_PUBLIC_META_LINK} />
        <meta property="twitter:title" content={process.env.NEXT_PUBLIC_META_TITLE} />
        <meta property="twitter:description" content={process.env.NEXT_PUBLIC_META_DESCRIPTION} />
        <meta property="twitter:image" content={process.env.NEXT_PUBLIC_META_IMAGE} />
      </Head>
      <NextNProgress />
      {pageLoaded ? <Component {...pageProps} /> : null}
    </>
  )
}

export default MyApp
