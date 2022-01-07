import React from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common';

import Button from './Button';

 export default function InlineSidebar(props) {
  const sidebar = useDocsSidebar();
  return sidebar
    .filter(i => i.docId !== 'index')
    .map(i => (
      <Button className="margin-bottom--sm" key={i.docId} to={i.href}>{i.label}</Button>
    ));
 }
