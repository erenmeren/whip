import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import '../assets/styles/style.scss';
import Navbar from '../components/navbar';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Whip - Be a Slave</title>
      </Head>
      <Navbar />
      <div className="page">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
