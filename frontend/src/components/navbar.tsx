import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.VoidFunctionComponent = () => (
  <nav
    className="navbar is-warning"
    role="navigation"
    aria-label="main navigation"
  >
    <div className="navbar-brand">
      <Link href="/">
        <a className="navbar-item">
          Whip
          <Image alt="Whip" src="/whip.png" width={32} height={32} />
        </a>
      </Link>
      <Link href="/about">
        <a className="navbar-item">About</a>
      </Link>
      <a
        role="button"
        className="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div className="navbar-menu">
      <div className="navbar-start">
        {/* <Link href="/">
          <a className="navbar-item">Home</a>
        </Link> */}
      </div>
    </div>
  </nav>
);

export default Navbar;
