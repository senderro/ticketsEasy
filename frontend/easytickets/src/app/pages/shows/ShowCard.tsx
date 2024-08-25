import React from 'react';
import { useRouter } from 'next/navigation';

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

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/pages/shows/${show.idshow}`);
  };

  return (
    <div className="show-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="show-card-image" style={{ backgroundImage: `url(https://gateway.pinata.cloud/ipfs/${show.ipfshash})` }}>
        <div className="show-card-overlay">
          <h3>{show.nomeshow}</h3>
        </div>
      </div>
      <div className="show-card-content">
        <p>{show.descricao}</p>
        <p>{new Date(show.datashow).toLocaleDateString()}</p>
        <p>{show.artistas}</p>
      </div>
    </div>
  );
};

export default ShowCard;
