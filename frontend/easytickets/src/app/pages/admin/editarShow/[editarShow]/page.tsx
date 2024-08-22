// app/admin/editar/[id]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
  datashow: string; // Use string para a data, pois o formato é ISO 8601
  artistas: string;
  destaque: boolean;
  tiposDeCadeira: TipoDeCadeira[];
}

export default function EditShowPage() {
  const router = useRouter();
  const id = useParams().editarShow;

  const [show, setShow] = useState<Show>({
    idshow: 0,
    nomeshow: '',
    descricao: '',
    datashow: '',
    artistas: '',
    destaque: false,
    tiposDeCadeira: [],
  });

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

  const handleShowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShow({
      ...show,
      [e.target.name]: e.target.value,
    });
  };

  const handleTipoCadeiraChange = (e: React.ChangeEvent<HTMLInputElement>, idTipoCadeira: number) => {
    const { name, value, type, checked } = e.target;
    setShow({
      ...show,
      tiposDeCadeira: show.tiposDeCadeira.map((tipo) =>
        tipo.idtipocadeira === idTipoCadeira
          ? {
              ...tipo,
              [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
            }
          : tipo
      ),
    });
  };

  const addTipoCadeira = () => {
    // Lógica para adicionar um novo TipoDeCadeira, se necessário
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/shows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...show,
          datashow: new Date(show.datashow).toISOString(),
        }),
      });
      console.log(response)
      if (response.ok) {
        console.log('Show atualizado com sucesso!');
       // router.push('/admin/shows'); // Redireciona para a lista de shows ou página desejada
      } else {
        console.error('Erro ao atualizar show:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao atualizar show:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  return (
    <div>
      <h1>Editar Show</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Show:</label>
          <input
            type="text"
            name="nomeshow"
            value={show.nomeshow}
            onChange={handleShowChange}
          />
        </div>

        <div>
          <label>Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={show.descricao}
            onChange={handleShowChange}
          />
        </div>

        <div>
          <label>Data do Show:</label>
          <input
            type="date"
            name="datashow"
            value={formatDate(show.datashow)}
            onChange={handleShowChange}
          />
        </div>

        <div>
          <label>Artistas:</label>
          <input
            type="text"
            name="artistas"
            value={show.artistas}
            onChange={handleShowChange}
          />
        </div>

        <div>
          <label>Destaque:</label>
          <input
            type="checkbox"
            name="destaque"
            checked={show.destaque}
            onChange={(e) => setShow({ ...show, destaque: e.target.checked })}
          />
        </div>

        <h2>Tipos de Cadeira</h2>
        {show.tiposDeCadeira.map((tipo) => (
          <div key={tipo.idtipocadeira}>
            <h3>Tipo de Cadeira {tipo.idtipocadeira}</h3>
            <div>
              <label>Nome do Tipo de Cadeira:</label>
              <input
                type="text"
                name="nometipocadeira"
                value={tipo.nometipocadeira}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
            </div>

            <div>
              <label>Quantidade Disponíveis:</label>
              <input
                type="number"
                name="quantidadedisponiveis"
                value={tipo.quantidadedisponiveis}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
            </div>

            <div>
              <label>Quantidade Compradas:</label>
              <input
                type="number"
                name="quantidadecompradas"
                value={tipo.quantidadecompradas}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
            </div>

            <div>
              <label>Preço (em Reais):</label>
              <input
                type="number"
                step="0.01"
                name="preco"
                value={tipo.preco}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
            </div>

            <div>
              <label>Tem Meia-Entrada:</label>
              <input
                type="checkbox"
                name="temmeia"
                checked={tipo.temmeia}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
            </div>
          </div>
        ))}

        <button type="submit">Atualizar Show</button>
      </form>
    </div>
  );
}
