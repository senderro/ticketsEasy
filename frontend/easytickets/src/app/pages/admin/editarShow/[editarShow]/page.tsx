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
  tiposDeCadeira: TipoDeCadeira[]; // Alterado para camelCase
}

export default function EditShowPage() {
  const router = useRouter();
  const editarShow = useParams().editarShow;

  const [show, setShow] = useState<Show>({
    idshow: 0,
    nomeshow: '',
    descricao: '',
    datashow: '',
    artistas: '',
    destaque: false,
    tiposDeCadeira: [], // Alterado para camelCase
  });

  const [newTipoCadeira, setNewTipoCadeira] = useState<Omit<TipoDeCadeira, 'idtipocadeira' | 'idestrangeirashow'>>({
    nometipocadeira: '',
    quantidadedisponiveis: 0,
    quantidadecompradas: 0,
    preco: 0,
    temmeia: false,
  });

  useEffect(() => {
    async function fetchShow() {
      if (editarShow) {
        try {
          const response = await fetch(`/api/shows/${editarShow}`);

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
  }, [editarShow]);

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

  const handleNewTipoCadeiraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewTipoCadeira({
      ...newTipoCadeira,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const addTipoCadeira = () => {
    setShow({
      ...show,
      tiposDeCadeira: [
        ...show.tiposDeCadeira,
        {
          idtipocadeira: show.tiposDeCadeira.length + 1,
          idestrangeirashow: show.idshow,
          ...newTipoCadeira,
        },
      ],
    });

    setNewTipoCadeira({
      nometipocadeira: '',
      quantidadedisponiveis: 0,
      quantidadecompradas: 0,
      preco: 0,
      temmeia: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/shows/${editarShow}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...show,
          datashow: new Date(show.datashow).toISOString(),
        }),
      });
      if (response.ok) {
        console.log('Show atualizado com sucesso!');
        // router.push('/admin/shows');
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

        <h2>Adicionar um Tipo de Cadeira</h2>
        <div>
          <label>Nome do Tipo de Cadeira:</label>
          <input
            type="text"
            name="nometipocadeira"
            value={newTipoCadeira.nometipocadeira}
            onChange={handleNewTipoCadeiraChange}
          />
        </div>

        <div>
          <label>Quantidade Disponíveis:</label>
          <input
            type="number"
            name="quantidadedisponiveis"
            value={newTipoCadeira.quantidadedisponiveis}
            onChange={handleNewTipoCadeiraChange}
          />
        </div>

        <div>
          <label>Preço (em Reais):</label>
          <input
            type="number"
            step="0.01"
            name="preco"
            value={newTipoCadeira.preco}
            onChange={handleNewTipoCadeiraChange}
          />
        </div>

        <div>
          <label>Tem Meia-Entrada:</label>
          <input
            type="checkbox"
            name="temmeia"
            checked={newTipoCadeira.temmeia}
            onChange={(e) =>
              setNewTipoCadeira({
                ...newTipoCadeira,
                temmeia: e.target.checked,
              })
            }
          />
        </div>

        <button type="button" onClick={addTipoCadeira}>
          Adicionar Tipo de Cadeira
        </button>

        <h2>Tipos de Cadeira Adicionados:</h2>
        <ul>
          {show.tiposDeCadeira && show.tiposDeCadeira.length > 0 ? (
            show.tiposDeCadeira.map((tipo) => (
              <li key={tipo.idtipocadeira}>
                {tipo.nometipocadeira} - Disponíveis: {tipo.quantidadedisponiveis} - Preço: R$ {tipo.preco.toFixed(2)} - Meia-Entrada: {tipo.temmeia ? 'Sim' : 'Não'}
              </li>
            ))
          ) : (
            <li>Nenhum tipo de cadeira adicionado.</li>
          )}
        </ul>

        <button type="submit">Atualizar Show</button>
      </form>
    </div>
  );
}
