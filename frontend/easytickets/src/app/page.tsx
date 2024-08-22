import React from 'react';
import Navbar from './components/Navbar.'; // Ensure correct path and name
import Carousel from './components/Carousel';


const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main style={styles.mainContent as React.CSSProperties}>
        <Carousel/>
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
