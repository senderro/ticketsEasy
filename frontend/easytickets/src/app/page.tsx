import React from 'react';
import Navbar from './components/Navbar.'; // Ensure correct path and name

const OPTIONS = { loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main style={styles.mainContent as React.CSSProperties}>
        <h1>carrosel</h1>
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
