"use client";
import React, { useState } from 'react';
import { uploadImageToPinata } from '../services/pinataService';

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const result = await uploadImageToPinata(file);
        setIpfsHash(result.IpfsHash);
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload para o Pinata</button>

      {ipfsHash && (
        <div>
          <p>Imagem carregada com sucesso! Hash IPFS:</p>
          <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">
            Ver imagem
          </a>
        </div>
      )}
    </div>
  );
}
