import React from 'react';
import Navbar from './components/Navbar.'; // Ensure correct path and name
import EmblaCarousel from './components/EmblaCarrossel';
import EmblaOptionsType from "embla-carousel-react"

const OPTIONS = { loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main style={styles.mainContent as React.CSSProperties}>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
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
