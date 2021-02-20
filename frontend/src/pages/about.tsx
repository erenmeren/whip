import React from 'react';
import Image from 'next/image';

const Home = (): JSX.Element => (
  <div className="container">
    <main>
      <Image src="/whiper.svg" width={300} height={300} alt="whiper" />
      <div className="content">
        <h1>Dear Jobseeker</h1>
        <p>
          We tried to gather a job search engines on one website for you, just
          to save you some time. Hope you will forget this website as soon as
          posible. Glad to be of help in this hard times. We're counting on you.
          Never lose your hope. Cheers !!!
        </p>
        <h2>Scraped Providers</h2>
        {/* <p>
          Curabitur accumsan turpis pharetra <strong>augue tincidunt</strong>{' '}
          blandit. Quisque condimentum maximus mi, sit amet commodo arcu rutrum
          id. Proin pretium urna vel cursus venenatis. Suspendisse potenti.
          Etiam mattis sem rhoncus lacus dapibus facilisis. Donec at dignissim
          dui. Ut et neque nisl.
        </p> */}
        <ul>
          <li>LinkedIn</li>
          <li>CW jobs</li>
          <li>Total jobs</li>
          <li>Job serve</li>
        </ul>
      </div>
    </main>
    <style global jsx>{`
      html,
      body {
        background-color: #ffdd57;
      }
    `}</style>
  </div>
);

export default Home;
