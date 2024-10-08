"use client";

import { ChangeEvent, useState } from "react";
import "./forms.css"; // Certifique-se de que o caminho do CSS esteja correto

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
  dataShow: Date | null;
  artistas: string;
  tiposDeCadeira: TipoDeCadeira[];
  imagemURI: string;
  desativado: boolean;
  destaque: boolean;
}

export default function Home() {
  const [show, setShow] = useState<Show>({
    idShow: 0,
    nomeShow: "",
    descricao: "",
    dataShow: new Date(),
    artistas: "",
    tiposDeCadeira: [],
    imagemURI: "",
    desativado: false,
    destaque: false,
  });

  const [tipoCadeira, setTipoCadeira] = useState<TipoDeCadeira>({
    idTipoCadeira: 0,
    nomeTipoCadeira: "",
    quantidadeDisponiveis: 0,
    quantidadeCompradas: 0,
    preco: 0,
    temMeia: false,
  });

  const handleShowChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setShow({
      ...show,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShow({
      ...show,
      dataShow: event.target.value ? new Date(event.target.value) : null,
    });
  };

  const handleTipoCadeiraChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTipoCadeira({
      ...tipoCadeira,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
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

  const [imagem, setImagem] = useState<File | null>(null);

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagem(e.target.files[0]);
    }
  };

  const uploadImagem = async () => {
    if (!imagem) return null;

    const formData = new FormData();
    formData.append("file", imagem);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ipfsHash = await uploadImagem();

    if (!ipfsHash) {
      console.error("Falha no upload da imagem");
      return;
    }

    try {
      const response = await fetch("/api/criarShow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...show, ipfshash: ipfsHash }),
      });

      if (response.ok) {
        console.log("Show e tipos de cadeiras adicionados com sucesso!");
      } else {
        console.error("Erro ao adicionar show");
      }
    } catch (error) {
      console.error("Erro ao adicionar show:", error);
    }
  };

  return (
    <div className="container">
      <h1>Criar Show</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="column">
            <div className="field">
              <label>Nome do Show:</label>
              <input
                className="input"
                type="text"
                name="nomeShow"
                value={show.nomeShow}
                onChange={handleShowChange}
              />
            </div>

            <div className="field">
              <label>Descrição:</label>
              <input
                className="input"
                type="text"
                name="descricao"
                value={show.descricao}
                onChange={handleShowChange}
              />
            </div>

            <div className="field">
              <label>Data do Show:</label>
              <input
                className="input"
                type="date"
                name="dataShow"
                value={show.dataShow ? show.dataShow.toISOString().split("T")[0] : ""}
                onChange={handleDateChange}
              />
            </div>

            <div className="field">
              <label>Artistas:</label>
              <input
                className="input"
                type="text"
                name="artistas"
                value={show.artistas}
                onChange={handleShowChange}
              />
            </div>

            <div className="field">
              <label>Imagem do Show:</label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
              />
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label>Desativado:</label>
              <input
                className="input"
                type="checkbox"
                name="desativado"
                checked={show.desativado}
                onChange={handleShowChange}
              />
            </div>

            <div className="field">
              <label>Destaque:</label>
              <input
                className="input"
                type="checkbox"
                name="destaque"
                checked={show.destaque}
                onChange={handleShowChange}
              />
            </div>

            <h2>Adicionar Tipo de Cadeira</h2>
            <div className="field">
              <label>Nome do Tipo de Cadeira:</label>
              <input
                className="input"
                type="text"
                name="nomeTipoCadeira"
                value={tipoCadeira.nomeTipoCadeira}
                onChange={handleTipoCadeiraChange}
              />
            </div>

            <div className="field">
              <label>Quantidade Disponíveis:</label>
              <input
                className="input"
                type="number"
                name="quantidadeDisponiveis"
                value={Math.floor(tipoCadeira.quantidadeDisponiveis)}
                onChange={handleTipoCadeiraChange}
              />
            </div>

            <div className="field">
              <label>Preço (em Reais):</label>
              <input
                className="input"
                type="number"
                step="0.01"
                name="preco"
                value={tipoCadeira.preco || ""}
                onChange={handleTipoCadeiraChange}
              />
            </div>

            <div className="field">
              <label>Tem Meia-Entrada:</label>
              <input
                className="input"
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

            <button type="button" className="button" onClick={addTipoCadeira}>
              Adicionar Tipo de Cadeira
            </button>
          </div>
        </div>

        <div className="field">
          <h3>Tipos de Cadeira Adicionados:</h3>
          <ul>
            {show.tiposDeCadeira.map((tipo, index) => (
              <li key={index} className="listItem">
                {tipo.nomeTipoCadeira} - Disponíveis: {tipo.quantidadeDisponiveis} - Preço: R$ {tipo.preco ? tipo.preco.toFixed(2) : '0.00'} - Meia-Entrada: {tipo.temMeia ? "Sim" : "Não"}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="button">Criar Show</button>
      </form>
    </div>
  );
}
