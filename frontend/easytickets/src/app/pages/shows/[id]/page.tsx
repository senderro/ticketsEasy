"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import "./showDetails.css";

interface TipoDeCadeira {
  idtipocadeira: number;
  idestrangeirashow: number;
  nometipocadeira: string;
  quantidadedisponiveis: number;
  quantidadecompradas: number;
  preco: number;
  temmeia: boolean;
}

interface Show {
  idshow: number;
  nomeshow: string;
  descricao: string;
  datashow: string;
  artistas: string;
  destaque: boolean;
  desativado: boolean; 
  tiposDeCadeira: TipoDeCadeira[];
  ipfshash: string;
}

export default function ShowDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [show, setShow] = useState<Show | null>(null);

  useEffect(() => {
    async function fetchShow() {
      if (id) {
        try {
          const response = await fetch(`/api/shows/${id}`);

          if (response.ok) {
            const data: Show = await response.json();
            setShow(data);
          } else {
            console.error('Erro ao buscar dados do show:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do show:', error);
        }
      }
    }
    fetchShow();
  }, [id]);

  const handleBuyTicket = async (tipoId: number) => {
    console.log(`Compra do ingresso para o tipo ${tipoId}`);
    router.push(`/purchase/${tipoId}`);
  };

  if (!show) return <div style={{ color: 'white' }}>Loading...</div>; // Texto branco para o estado de loading

  return (
    <div className="show-details">
      <div className="show-info">
        <h1>{show.nomeshow}</h1>
        <div className="show-description">
          <p>{show.descricao}</p>
          <p><strong>Data:</strong> {new Date(show.datashow).toLocaleDateString()}</p>
          <p><strong>Artistas:</strong> {show.artistas}</p>
        </div>
        <div className="ticket-types">
          <h2>Tipos de Ingressos</h2>
          {show.tiposDeCadeira.map((tipo) => (
            <div key={tipo.idtipocadeira} className="ticket-type">
              <h3>{tipo.nometipocadeira}</h3>
              <p><strong>Quantidade Disponível:</strong> {tipo.quantidadedisponiveis - tipo.quantidadecompradas}</p>
              <p><strong>Preço:</strong> R$ {tipo.preco.toFixed(2)}</p>
              <p><strong>Meia-Entrada:</strong> {tipo.temmeia ? 'Sim' : 'Não'}</p>
              {tipo.quantidadedisponiveis - tipo.quantidadecompradas > 0 ? (
                <button onClick={() => handleBuyTicket(tipo.idtipocadeira)}>Comprar</button>
              ) : (
                <p>Ingressos esgotados</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <img
        src={`https://gateway.pinata.cloud/ipfs/${show.ipfshash}`}
        alt={show.nomeshow}
        className="show-image"
      />
    </div>
  );
}
