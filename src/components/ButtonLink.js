import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';
import Link from '@docusaurus/Link';

export default function ButtonLink({className, ...props}) {
  return <a className={clsx(className, styles.button)} {...props} />;
}
