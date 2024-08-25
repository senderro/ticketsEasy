import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Show {
  id: number;
  title: string;
  date: string;
  location: string;
}

export default function EditarShow() {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    // Supondo que a API para listar shows seja `api/shows`
    fetch('/api/shows')
      .then((response) => response.json())
      .then((data) => setShows(data))
      .catch((error) => console.error('Erro ao carregar shows:', error));
  }, []);

  return (
    <div>
      <h1>Editar Shows</h1>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            <Link href={`/admin/editarShow/${show.id}`}>
              {show.title} - {show.date} - {show.location}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
