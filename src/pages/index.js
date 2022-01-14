import React from 'react';
import Navbar from '@theme/Navbar';
import Button from '../components/Button';

export default function Home() {
  return <div className="container" style={{textAlign: 'center'}}>
    <h1 className="padding-vert--lg">Dasha Filippova</h1>
    <video src="../intro.mp4" autoPlay controls={false} loop style={{width: '100%'}} muted/>
    <hr/>
    <div className="container padding-vert--md" >
      <Button to="/artist">Artist</Button>
      <Button to="/scholar">Scholar</Button>
      <Button to="/other">Other</Button>
      <Button to="/about">About</Button>
  </div>
  </div>;
}
