import React from 'react';
import styles from './header.module.scss';

const Header = () => (
  <div className={styles.header}>
    <nav id="menu" className="menu">
      <ul>
        <li><a href="/" className={styles.link}><span style={{ padding: "60px" }}></span></a></li>

        <li><a href="/publish" className={styles.link}> Publish</a></li>

        {process.env.NODE_ENV !== 'photo_marketplace' && (
          <li><a href="/photo_marketplace" className={styles.link}> PhotoMarketPlace</a></li>
        )}

      </ul>
    </nav>
  </div>
)

export default Header;
