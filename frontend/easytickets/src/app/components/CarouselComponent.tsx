"use client";
import React, { useEffect, useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

interface Show {
  idshow: number;
  nomeshow: string;
  descricao: string;
  datashow: string;
  artistas: string;
  destaque: boolean;
  desativado: boolean;
  tiposdecadeira: TipoDeCadeira[];
  ipfshash: string;
}

interface TipoDeCadeira {
  idtipocadeira: number;
  idestrangeirashow: number;
  nometipocadeira: string;
  quantidadedisponiveis: number;
  quantidadecompradas: number;
  preco: number;
  temmeia: boolean;
}

const MyCarousel: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('/api/featuredShows');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Show[] = await response.json();
        setShows(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchShows();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <ReactSimplyCarousel
    activeSlideIndex={activeSlideIndex} // Use o estado para rastrear o slide ativo
    onRequestChange={setActiveSlideIndex} // Atualize o índice do slide ativo
    itemsToShow={1} // Exibir apenas uma imagem por vez
    itemsToScroll={1} // Rolagem de um slide por vez
      forwardBtnProps={{
        style: {
          alignSelf: 'center',
          background: 'black',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          fontSize: '30px',  // Aumenta o tamanho do botão
          height: 50,  // Aumenta o tamanho do botão
          lineHeight: 1,
          textAlign: 'center',
          width: 50,  // Aumenta o tamanho do botão
        },
        children: <span>{`>`}</span>,
      }}
      backwardBtnProps={{
        style: {
          alignSelf: 'center',
          background: 'black',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          fontSize: '30px',  // Aumenta o tamanho do botão
          height: 50,  // Aumenta o tamanho do botão
          lineHeight: 1,
          textAlign: 'center',
          width: 50,  // Aumenta o tamanho do botão
        },
        children: <span>{`<`}</span>,
      }}
      speed={400}
      easing="linear"
    >
      {shows.length > 0 ? (
        shows.map((show) => (
          <div
            key={show.idshow}
            style={{
              width: '1000px',  // Aumenta a largura
              height: '600px',  // Aumenta a altura
              backgroundImage: `url(https://gateway.pinata.cloud/ipfs/${show.ipfshash})`,
              backgroundSize: 'contain',  // Altera para 'contain' para evitar corte
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',  // Evita repetição da imagem
            }}
          >
            {/* Adicione mais conteúdo aqui se desejar */}
          </div>
        ))
      ) : (
        <div
          style={{
            width: '1000px',
            height: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#333',
            fontSize: '32px',  // Aumenta o tamanho da fonte
            textAlign: 'center',
          }}
        >
          <h1>Não há shows disponíveis no momento</h1>
        </div>
      )}
    </ReactSimplyCarousel>
  );
};

export default MyCarousel;
