import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';
import Link from '@docusaurus/Link';

export default function Button({className, children, title, ...props}) {
  return (
    <div
      {...props}
      className={clsx(className, styles.card)}
    >
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
