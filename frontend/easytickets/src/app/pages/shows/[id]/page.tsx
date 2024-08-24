// /app/shows/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import "./showDetails.css";
import { useAccount } from "wagmi";

import { easyTicketsAbi } from '@/generated';
import { useWriteEasyTicketsSafeMint } from '@/generated';
import { parseEther } from "viem";
import { Address } from "viem";

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
  const [ethPrice, setEthPrice] = useState<number>(0); // Guardar a taxa de conversão BRL para ETH

  const { writeContractAsync, isSuccess, isError, isPending } = useWriteEasyTicketsSafeMint();

  const { address: accountAddress } = useAccount();

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
  
  useEffect(() => {
    // Buscar a taxa de conversão BRL -> ETH
    async function fetchEthPrice() {
      try {
        const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BRL&tsyms=ETH');
        const data = await response.json();
        setEthPrice(data.ETH);
      } catch (error) {
        console.error('Erro ao buscar taxa de conversão ETH:', error);
      }
    }
    fetchEthPrice();
  }, []);
  const handleBuyTicket = async (tipoId: number, preco: number) => {
    if (!ethPrice) {
      console.error('Taxa de conversão ETH não disponível.');
      return;
    }
  
    const precoEmEth = preco * ethPrice; // Calculando o preço em ETH
    const value = BigInt(Math.floor(precoEmEth)); // Convertendo para BigInt
    
    await writeContractAsync({
      address: "0x4c168D60Cda9c86E9388b3a73A5521A5Dd72eC5B",
      args: [accountAddress as Address, "ipfs://QmaAQdh7fUVr9vzsfvqJKccGF2r2ZZ1DDmNp6oPaSpk2KL", value],
      value: value, // Passando o valor como BigInt
    });
  
    console.log(precoEmEth);
    console.log(parseEther(precoEmEth.toString()));
  };

  if (!show) return <div>Loading...</div>;

  return (
    <div className="show-details">
      <h1>{show.nomeshow}</h1>
      <img
        src={`https://gateway.pinata.cloud/ipfs/${show.ipfshash}`}
        alt={show.nomeshow}
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
      />
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
              <button onClick={() => handleBuyTicket(tipo.idtipocadeira,tipo.preco)}>Comprar</button>
            ) : (
              <p>Ingressos esgotados</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
