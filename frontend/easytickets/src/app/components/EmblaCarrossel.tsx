"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons';

import './embla.css';

interface Show {
  idShow: number;
  nomeShow: string;
  descricao: string;
  dataShow: Date;
  artistas: string;
  imageSrc: string;
}

const shows: Show[] = [
  {
    idShow: 1,
    nomeShow: "Show 1",
    descricao: "Descrição do Show 1",
    dataShow: new Date("2024-08-30"),
    artistas: "Artista 1",
    imageSrc: "/teste.png"
  },
  {
    idShow: 2,
    nomeShow: "Show 2",
    descricao: "Descrição do Show 2",
    dataShow: new Date("2024-09-15"),
    artistas: "Artista 2",
    imageSrc: "/teste.png"
  },
  {
    idShow: 3,
    nomeShow: "Show 3",
    descricao: "Descrição do Show 3",
    dataShow: new Date("2024-10-05"),
    artistas: "Artista 3",
    imageSrc: "/teste.png"
  },
  {
    idShow: 4,
    nomeShow: "Show 4",
    descricao: "Descrição do Show 4",
    dataShow: new Date("2024-11-20"),
    artistas: "Artista 4",
    imageSrc: "teste.png"
  }
];

type PropType = {
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: false, delay: 3000 })
  ]);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoplay = emblaApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on('autoplay:play', () => setIsPlaying(true))
      .on('autoplay:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoplay.isPlaying()));
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {shows.map((show) => (
            <div className="embla__slide" key={show.idShow}>
              <img src={"https://picsum.photos/200"} alt={show.nomeShow} className="embla__slide__img" />
              <div className="embla__slide__overlay">
                <h2 className="embla__slide__title">{show.nomeShow}</h2>
                <p className="embla__slide__description">{show.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
