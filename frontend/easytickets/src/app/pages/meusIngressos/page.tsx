"use client";
import React, { useEffect, useState } from 'react';
import { useReadContract } from "wagmi";
import { easyTicketsAbi } from '@/generated';
import { useAccount } from "wagmi";

const MyTickets: React.FC = () => {
  const { address: accountAddress } = useAccount();
  const [showData, setShowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const result = useReadContract({
    abi: easyTicketsAbi,
    functionName: "tokenURIsOfOwner",
    address: "0xAf9f940E78f06DB60FA262EF283c31de141285d9",
    args: [accountAddress as `0x${string}`],
  });

  
  useEffect(() => {
    if (result.data) {
      const fetchData = async () => {
        const data = await Promise.all(
          (result.data as string[]).map(async (hash) => {
            const response = await fetch(`https://moccasin-quickest-mongoose-160.mypinata.cloud/ipfs/${hash}`);
            const json = await response.json();
            return json;
          })
        );
        setShowData(data);
        setLoading(false);
      };

      fetchData();
    }
  }, [result.data]);

  // Renderizar uma tela de carregamento até que os dados estejam prontos
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {showData.map((show, index) => (
        <div
          key={index}
          style={{
            width: '300px',
            height: '400px',
            backgroundImage: `url(${show.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '20px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <h3>{show.name}</h3>
          <p>{show.description}</p>
          <p><strong>Data:</strong> {new Date(show.datashow).toLocaleDateString()}</p>
          <p><strong>Tipo de Cadeira:</strong> {show.tipocadeira}</p>
          <p><strong>Preço:</strong> R$ {show.preco.toFixed(2)}</p>
          <p><strong>Meia-Entrada:</strong> {show.meia ? 'Sim' : 'Não'}</p>
        </div>
      ))}
    </div>
  );
};

export default MyTickets;
