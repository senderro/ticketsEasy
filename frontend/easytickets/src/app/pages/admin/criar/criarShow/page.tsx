"use client"
import { useState } from "react";

interface TipoDeCadeira {
  idTipoCadeira: number;
  nomeTipoCadeira: string;
  quantidadeDisponiveis: number;
  quantidadeCompradas: number;
  preco: number;
  temMeia: boolean;
}

interface Show {
  idShow: number;
  nomeShow: string;
  descricao: string;
  dataShow: Date;
  artistas: string;
  tiposDeCadeira: TipoDeCadeira[];
}

export default function Home() {
  const [show, setShow] = useState<Show>({
    idShow: 0,
    nomeShow: "",
    descricao: "",
    dataShow: new Date(),
    artistas: "",
    tiposDeCadeira: [],
  });

  const [tipoCadeira, setTipoCadeira] = useState<TipoDeCadeira>({
    idTipoCadeira: 0,
    nomeTipoCadeira: "",
    quantidadeDisponiveis: 0,
    quantidadeCompradas: 0,
    preco: 0,
    temMeia: false,
  });

  const handleShowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShow({
      ...show,
      [e.target.name]: e.target.value,
    });
  };

  const handleTipoCadeiraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTipoCadeira({
      ...tipoCadeira,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const addTipoCadeira = () => {
    setShow({
      ...show,
      tiposDeCadeira: [...show.tiposDeCadeira, tipoCadeira],
    });

    setTipoCadeira({
      idTipoCadeira: show.tiposDeCadeira.length + 1,
      nomeTipoCadeira: "",
      quantidadeDisponiveis: 0,
      quantidadeCompradas: 0,
      preco: 0,
      temMeia: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/criarShow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(show),
      });
  
      if (response.ok) {
        console.log('Show e tipos de cadeiras adicionados com sucesso!');
      } else {
        console.error('Erro ao adicionar show');
      }
    } catch (error) {
      console.error('Erro ao adicionar show:', error);
    }
  };

  return (
    <div>
      <h1>Criar Show</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Show:</label>
          <input
            type="text"
            name="nomeShow"
            value={show.nomeShow}
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
            name="dataShow"
            value={show.dataShow.toISOString().split("T")[0]}
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

        <h2>Adicionar Tipo de Cadeira</h2>
        <div>
          <label>Nome do Tipo de Cadeira:</label>
          <input
            type="text"
            name="nomeTipoCadeira"
            value={tipoCadeira.nomeTipoCadeira}
            onChange={handleTipoCadeiraChange}
          />
        </div>

        <div>
          <label>Quantidade Disponíveis:</label>
          <input
            type="number"
            name="quantidadeDisponiveis"
            value={Math.floor(tipoCadeira.quantidadeDisponiveis)} // Garante que seja um número inteiro
            onChange={handleTipoCadeiraChange}
          />
        </div>

        <div>
          <label>Preço (em Reais):</label>
          <input
            type="number"
            step="0.01"
            name="preco"
            value={tipoCadeira.preco || ''} // Use uma string vazia se `preco` for undefined ou null
            onChange={handleTipoCadeiraChange}
          />
        </div>

        <div>
          <label>Tem Meia-Entrada:</label>
          <input
            type="checkbox"
            name="temMeia"
            checked={tipoCadeira.temMeia}
            onChange={(e) =>
              setTipoCadeira({
                ...tipoCadeira,
                temMeia: e.target.checked,
              })
            }
          />
        </div>

        <button type="button" onClick={addTipoCadeira}>
          Adicionar Tipo de Cadeira
        </button>

        <div>
          <h3>Tipos de Cadeira Adicionados:</h3>
          <ul>
            {show.tiposDeCadeira.map((tipo, index) => (
              <li key={index}>
              {tipo.nomeTipoCadeira} - Disponíveis: {tipo.quantidadeDisponiveis} - Preço: R$ {tipo.preco ? tipo.preco.toFixed(2) : '0.00'} - Meia-Entrada: {tipo.temMeia ? "Sim" : "Não"}
            </li>
            ))}
          </ul>
        </div>

        <button type="submit">Criar Show</button>
      </form>
    </div>
  );
}
