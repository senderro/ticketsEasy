"use client";
import { useState } from 'react';
import Image from 'next/image';
import './Carousel.css';

const images = [
  { id: 'item1', src: 'https://picsum.photos/200', alt: 'Foto 1' },
  { id: 'item2', src: 'https://picsum.photos/200', alt: 'Foto 2' },
  // Adicione mais itens conforme necessário
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="carouselContainer">
      <div className="carousel">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="carouselItem"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            <img
              src={image.src}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: '1000px' }} // optional
            
              alt={image.alt}
            />
          </div>
        ))}
      </div>
      <div className="controls">
        {images.map((_, index) => (
          <div
            key={index}
            className={`btn ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
}