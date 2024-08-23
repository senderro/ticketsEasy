import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão para lidar com FormData
  },
};

const formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data', error: err });
    }

    const file = files.file;

    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.filepath)); // Caminho do arquivo temporário

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // JWT Token
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data); // Retorna o hash do IPFS
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({ message: 'Failed to upload file', error: errorData });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server Error', error });
    }
  });
}
