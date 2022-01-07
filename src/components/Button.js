import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';
import Link from '@docusaurus/Link';
import { NavLink } from 'react-router-dom'

export default function Button({className, ...props}) {
  return (
    <NavLink
      {...props}
      className={isActive => clsx(className, styles.button, isActive && styles.active)}
    />
  );
}
