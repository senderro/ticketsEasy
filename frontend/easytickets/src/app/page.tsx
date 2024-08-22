import Navbar from './components/Navbar.';
import EmblaCarousel from './components/EmblaCarrossel';
import { EmblaOptionsType } from 'embla-carousel'

import React from 'react';

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Home() {
  return (
    <div>
  
      
      <Navbar />
      <main style={styles.mainContent as React.CSSProperties}>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </main>
    </div>
  );
}

const styles = {
  mainContent: {
    padding: '20px',
    textAlign: 'center',
  } as React.CSSProperties, // Casting to React.CSSProperties
};
