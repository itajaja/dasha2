import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';
import Link from '@docusaurus/Link';

export default function Button({className, children, title,tiled,  ...props}) {
  return (
    <div
      {...props}
      className={clsx(className, styles.card, tiled && styles.tileContainer)}
    >
      <div className={clsx(styles.title)}>{title}</div>
      <div className={clsx(styles.content, tiled && styles.tileContent)}>
        {children}
      </div>
    </div>
  );
}
