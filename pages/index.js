import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <>
    <Head>
      <title>{process.env.NEXT_PUBLIC_HOME_TITLE}</title>
      </Head>

      <div className="flex justify-center h-screen w-screen items-center flex-col">
        <p className="text-white text-xl font-bold">Sorry, we can&#39;t allow you here.</p>
        <p className="p-2">To claim Linkvertise on DNxRG, you have to Go to <Link
          href="https://dnxrg.net/discord">
            <div
          className="text-blue-700 cursor-pointer flex justify-center text-2xl pt-5 pb-5">
            DNxRG Discord.</div></Link>
        </p>
        <p>After you are in, Just find Linkvertise channel and use /linkvertise.</p>
      </div>
    </>
  )
}
