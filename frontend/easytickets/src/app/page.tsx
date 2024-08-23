import React from 'react';
import MyCarousel from './components/MyCarousel';

import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = {}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const Home: React.FC = () => {
  return (
    <div> 
      <main style={styles.mainContent as React.CSSProperties}>
        <MyCarousel slides={SLIDES} options={OPTIONS} />
      </main>
    </div>
  );
};

const styles = {
  mainContent: {
    padding: '20px',
    textAlign: 'center',
  } as React.CSSProperties,
};

export default Home;
