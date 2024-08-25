"use client";

import React, { useState, useEffect } from 'react';
import ShowCard from './ShowCard';
import FilterBar from './FilterBar';
import "./catalog.css";
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

const ActiveShowsPage: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', sortBy: '', order: '' });

  useEffect(() => {
    const fetchShows = async () => {
      const { name, sortBy, order } = filters;
      try {
        console.log('Fetching shows with filters:', filters); // Debug log
        const response = await fetch(`/api/activeShows?query=${encodeURIComponent(name)}&orderBy=${encodeURIComponent(sortBy)}&orderDirection=${encodeURIComponent(order)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false); // Ensure loading state is set to false after fetching
      }
    };

    fetchShows();
  }, [filters]); // Dependency array updated to use filters

  return (
    <div>
      <FilterBar setFilters={setFilters} />
      {loading ? (
        <p style={{ color: 'white' }}>Loading...</p> 
      ) : (
        <div className="catalog-grid">
          {shows.map(show => (
            <ShowCard key={show.idshow} show={show} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveShowsPage;
