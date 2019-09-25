import React, { Component } from "react";
import styles from './Hero.module.scss';
import cx from 'classnames';

export default class Hero extends Component {
  render()  {
    return (
      <div className={styles.left}>
        <br />
        <h4> Top Page</h4>
      </div>
    );
  }
}
