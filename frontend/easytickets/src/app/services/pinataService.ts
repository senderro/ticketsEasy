// services/pinataService.ts
import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET!;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

export const uploadImageToPinata = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${PINATA_BASE_URL}/pinning/pinFileToIPFS`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao enviar imagem para o Pinata:', error);
    throw error;
  }
};
