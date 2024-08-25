"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import "./showDetails.css";
import { useAccount } from "wagmi";

import { easyTicketsAbi } from '@/generated';
import { useWriteEasyTicketsComprarIngresso } from '@/generated';
import { ContractFunctionExecutionError, parseEther } from "viem";
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

  const { writeContractAsync, isSuccess, isError, isPending } = useWriteEasyTicketsComprarIngresso();

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


  const handleBuyTicket = async (tipoCad: TipoDeCadeira) => {
    if (!ethPrice) {
      console.error('Taxa de conversão ETH não disponível.');
      return;
    }
  
    const precoEmEth = tipoCad.preco * ethPrice*10**15; // Calculando o preço em ETH
    const value = BigInt(Math.floor(precoEmEth)); 
    if (show && tipoCad) { 
    try{

      const jsonHash = await uploadJsonToPinata(show, tipoCad);
      if (jsonHash) {
        console.log('JSON uploaded successfully, IPFS hash:', jsonHash);
      }

      await writeContractAsync({
        address: "0xfA017a06b73adf0aB1725AA65f686d07d260446B" as `0x${string}`,
        args: [accountAddress as `0x${string}`, jsonHash as string, BigInt(0)],
        value: value, 
      });

    }catch(error){
      if (error instanceof ContractFunctionExecutionError) {
        const cause = error.cause
        console.log(cause);
      }
    }
  }
  
    console.log(precoEmEth);
    console.log(parseEther(precoEmEth.toString()));
  };


  const uploadJsonToPinata = async (show: Show, tipoCadeira: TipoDeCadeira) => {
    const jsonData = {
      name: show.nomeshow,
      idShow: show.idshow,
      description: show.descricao,
      image: `https://moccasin-quickest-mongoose-160.mypinata.cloud/ipfs/${show.ipfshash}`,
      tipocadeira: tipoCadeira.nometipocadeira,
      datashow: show.datashow,
      preco: tipoCadeira.preco,
      meia: tipoCadeira.temmeia,
    };
  
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZjI3MWE1MC1mZDhlLTQ5MGMtODFiNy1kZTBmZWNkMmM0NmIiLCJlbWFpbCI6ImxvcmVuem9oZW5yaXF1ZXBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijg0MTg4YjMyOGE0NzIyMDhlMzcwIiwic2NvcGVkS2V5U2VjcmV0IjoiNGU1NGI3Mjc0M2M3NGRhMjkzZGUwNzQzMGM5ZDI0NDAzNWVjNmQ2Y2U2NjE0MTY4OTQ0ZWJiMjM5Y2RlNGY2YyIsImV4cCI6MTc1NTkwNTI1N30.tXU-pHwTsXGyQ7ZhqntnNn1-0-8UTPwfLoBsVlgOrZ4"}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
  
      const data = await response.json();
      return data.IpfsHash; // Retorna o hash IPFS do JSON
    } catch (error) {
      console.error('Erro ao fazer upload do JSON:', error);
      return null;
    }
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
                <button onClick={() => handleBuyTicket(tipo)}>Comprar</button>
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
