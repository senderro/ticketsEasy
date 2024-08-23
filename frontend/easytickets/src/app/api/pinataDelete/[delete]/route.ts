// pages/api/pinata/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PinataSDK } from 'pinata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extrai o hash da URL da requisição
  const { hash } = req.query;
  if (typeof hash !== 'string') {
    return res.status(400).json({ message: 'Hash is required' });
  }

  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: "https://gateway.pinata.cloud", // Use o gateway padrão ou um personalizado
    });
    
    // Faz o unpin no Pinata
    await pinata.unpin([hash]);

    return res.status(200).json({ message: 'Unpinned successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
}
