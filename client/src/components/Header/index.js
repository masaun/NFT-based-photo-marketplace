import React from 'react';
import styles from './header.module.scss';

const Header = () => (
  <div className={styles.header}>
    <nav id="menu" className="menu">
      <ul>
        <li><a href="/" className={styles.link}><span style={{ padding: "60px" }}></span></a></li>

        <li><a href="/" className={styles.link}> Home</a></li>

        {process.env.NODE_ENV !== 'cz_exchange' && (
          <li><a href="/cz_exchange" className={styles.link}> CzExchange</a></li>
        )}

      </ul>
    </nav>
  </div>
)

export default Header;
