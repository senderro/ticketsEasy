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
  datashow: string;
  artistas: string;
  destaque: boolean;
  desativado: boolean; 
  tiposDeCadeira: TipoDeCadeira[];
  ipfshash: string;
}


export default function EditShowPage() {
  const router = useRouter();
  const { editarShow } = useParams();
  
  const [show, setShow] = useState<Show>({
    idshow: 0,
    nomeshow: '',
    descricao: '',
    datashow: '',
    artistas: '',
    destaque: false,
    desativado: false,  // Valor inicial da nova coluna
    tiposDeCadeira: [],
    ipfshash: '',
  });
  
  const [newTipoCadeira, setNewTipoCadeira] = useState<Omit<TipoDeCadeira, 'idtipocadeira' | 'idestrangeirashow'>>({
    nometipocadeira: '',
    quantidadedisponiveis: 0,
    quantidadecompradas: 0,
    preco: 0,
    temmeia: false,
  });

  const [newImageFile, setNewImageFile] = useState<File | null>(null);

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
    setShow((prevShow) => ({
      ...prevShow,
      tiposDeCadeira: prevShow.tiposDeCadeira.map((tipo) =>
        tipo.idtipocadeira === idTipoCadeira
          ? {
              ...tipo,
              [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
            }
          : tipo
      ),
    }));
  };

  const handleNewTipoCadeiraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewTipoCadeira({
      ...newTipoCadeira,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const addTipoCadeira = () => {
    setShow((prevShow) => ({
      ...prevShow,
      tiposDeCadeira: [
        ...prevShow.tiposDeCadeira,
        {
          idtipocadeira: prevShow.tiposDeCadeira.length + 1,
          idestrangeirashow: prevShow.idshow,
          ...newTipoCadeira,
        },
      ],
    }));

    setNewTipoCadeira({
      nometipocadeira: '',
      quantidadedisponiveis: 0,
      quantidadecompradas: 0,
      preco: 0,
      temmeia: false,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleImageDelete = async (cid: string) => {
    try {
      const token = process.env.NEXT_PUBLIC_PINATA_JWT; // Substitua pelo seu token real do Pinata
  
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Obtenha a resposta como texto
        throw new Error(`Failed to delete image: ${errorText}`);
      }
  
      const responseText = await response.text(); // Obtenha a resposta como texto
      console.log('Image deleted successfully:', responseText);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let newHash = show.ipfshash;

      // Se uma nova imagem foi selecionada
      if (newImageFile) {
        // Faz o upload da nova imagem para o Pinata
        const formData = new FormData();
        formData.append('file', newImageFile);

        const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        });

        if (pinataResponse.ok) {
          const pinataData = await pinataResponse.json();
          newHash = pinataData.IpfsHash; // Atualiza com o novo hash da imagem

          // Delete the old image only after the new one is successfully uploaded
          if (show.ipfshash) {
            await handleImageDelete(show.ipfshash.split('/').pop() || '');
          }
        } else {
          console.error('Erro ao fazer upload para o Pinata:', pinataResponse.statusText);
          return; // Stop the submit process if upload fails
        }
      }

      // Atualiza o show com o novo hash da imagem
      const response = await fetch(`/api/shows/${editarShow}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...show,
          datashow: new Date(show.datashow).toISOString(),
          ipfshash: newHash, // Atualiza o hash no banco de dados
        }),
      });

      if (response.ok) {
        console.log('Show atualizado com sucesso!');
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


  const formatIpfsUrl = (hash: string, gateway: string = 'https://moccasin-quickest-mongoose-160.mypinata.cloud/ipfs/') => {
    return `${gateway}${hash}`;
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
        <div>
          <label>Desativado:</label> {/* Novo campo de desativado */}
          <input
            type="checkbox"
            name="desativado"
            checked={show.desativado}
            onChange={(e) => setShow({ ...show, desativado: e.target.checked })}
          />
        </div>
        <div>
          <label>Imagem Atual:</label>
          {show.ipfshash && (
            <div>
              <img
                src={formatIpfsUrl(show.ipfshash)}
                alt="Imagem do Show"
                width="200"
              />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
  
        <h2>Adicionar um Tipo de Cadeira</h2>
        <div>
          <label>Nome:</label>
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
          <label>Quantidade Compradas:</label>
          <input
            type="number"
            name="quantidadecompradas"
            value={newTipoCadeira.quantidadecompradas}
            onChange={handleNewTipoCadeiraChange}
          />
        </div>
  
        <div>
          <label>Preço:</label>
          <input
            type="number"
            name="preco"
            value={newTipoCadeira.preco}
            onChange={handleNewTipoCadeiraChange}
          />
        </div>
  
        <div>
          <label>Meia Entrada:</label>
          <input
            type="checkbox"
            name="temmeia"
            checked={newTipoCadeira.temmeia}
            onChange={handleNewTipoCadeiraChange}
          />
        </div>
  
        <button type="button" onClick={addTipoCadeira}>Adicionar Tipo de Cadeira</button>
  
        <h2>Tipos de Cadeira Existentes</h2>
        <ul>
          {show.tiposDeCadeira.map((tipo) => (
            <li key={tipo.idtipocadeira}>
              <div>
                <label>Nome:</label>
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
                <label>Preço:</label>
                <input
                  type="number"
                  name="preco"
                  value={tipo.preco}
                  onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
                />
              </div>
  
              <div>
                <label>Meia Entrada:</label>
                <input
                  type="checkbox"
                  name="temmeia"
                  checked={tipo.temmeia}
                  onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
                />
              </div>
            </li>
          ))}
        </ul>
  
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}  