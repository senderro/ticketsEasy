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
    desativado: false,
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

  const uploadImagem = async () => {
    if (!newImageFile) return null;

    const formData = new FormData();
    formData.append('file', newImageFile);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.IpfsHash; // Retornar apenas o hash da imagem
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  };

  const handleImageDelete = async (cid: string) => {
    try {
      const token = process.env.NEXT_PUBLIC_PINATA_JWT;
  
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

      if (newImageFile) {
        // Faz o upload da nova imagem para o Pinata
        const ipfsHash = await uploadImagem();
        if (!ipfsHash) {
          console.error('Falha no upload da imagem');
          return;
        }
        newHash = ipfsHash;

        // Delete the old image only after the new one is successfully uploaded
        if (show.ipfshash) {
          await handleImageDelete(show.ipfshash.split('/').pop() || '');
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
        router.push('/shows'); // Redirecionar após atualização
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
          <label>Desativado:</label>
          <input
            type="checkbox"
            name="desativado"
            checked={show.desativado}
            onChange={(e) => setShow({ ...show, desativado: e.target.checked })}
          />
        </div>

        <div>
          <label>Imagem:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div>
          {show.ipfshash && (
            <img
              src={formatIpfsUrl(show.ipfshash)}
              alt="Imagem do Show"
              style={{ maxWidth: '300px', maxHeight: '300px' }}
            />
          )}
        </div>

        <div>
          <h2>Tipos de Cadeira</h2>
          {show.tiposDeCadeira.map((tipo) => (
            <div key={tipo.idtipocadeira}>
              <h3>{tipo.nometipocadeira}</h3>
              <label>Quantidade Disponivel: {tipo.quantidadedisponiveis-tipo.quantidadecompradas}</label>
              <br />
              <label>Preço:</label>
              <input
                type="number"
                name="preco"
                value={tipo.preco}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
              <br />
              <label>Meia-Entrada:</label>
              <input
                type="checkbox"
                name="temmeia"
                checked={tipo.temmeia}
                onChange={(e) => handleTipoCadeiraChange(e, tipo.idtipocadeira)}
              />
              <br />
            </div>
          ))}

          <div>
            <h3>Adicionar Novo Tipo de Cadeira</h3>
            <label>Nome do Tipo de Cadeira:</label>
            <input
              type="text"
              name="nometipocadeira"
              value={newTipoCadeira.nometipocadeira}
              onChange={handleNewTipoCadeiraChange}
            />
            <br />
            <label>Quantidade Disponível:</label>
            <input
              type="number"
              name="quantidadedisponiveis"
              value={newTipoCadeira.quantidadedisponiveis}
              onChange={handleNewTipoCadeiraChange}
            />
            <br />
            <label>Preço:</label>
            <input
              type="number"
              name="preco"
              value={newTipoCadeira.preco}
              onChange={handleNewTipoCadeiraChange}
            />
            <br />
            <label>Meia-Entrada:</label>
            <input
              type="checkbox"
              name="temmeia"
              checked={newTipoCadeira.temmeia}
              onChange={handleNewTipoCadeiraChange}
            />
            <br />
            <button type="button" onClick={addTipoCadeira}>Adicionar Tipo de Cadeira</button>
          </div>
        </div>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
