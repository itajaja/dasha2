import React from 'react';
import clsx from 'clsx';
import styles from './button.module.css';
import Link from '@docusaurus/Link';
import { NavLink } from 'react-router-dom'

export default function Button(props) {
  return (
    <NavLink
      {...props}
      className={isActive => clsx(styles.button, isActive && styles.active)}
    />
  );
}
