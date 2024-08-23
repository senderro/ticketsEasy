import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Cria a tabela "show" com o campo "ipfsHash"
    await sql`
      CREATE TABLE IF NOT EXISTS show (
        idshow SERIAL PRIMARY KEY,
        nomeshow VARCHAR(255) NOT NULL,
        descricao VARCHAR(255),
        datashow DATE NOT NULL,
        artistas VARCHAR(255),
        destaque BOOLEAN,
        ipfshash VARCHAR(255),
        desativado BOOLEAN DEFAULT FALSE,
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tipoCadeira (
        idtipocadeira SERIAL PRIMARY KEY,
        idestrangeirashow INT REFERENCES show(idShow),
        nometipocadeira VARCHAR(255) NOT NULL,
        quantidadedisponiveis INT NOT NULL,
        quantidadecompradas INT DEFAULT 0,
        preco FLOAT NOT NULL,
        temmeia BOOLEAN
      );
    `;

    return NextResponse.json({ message: 'Tabelas criadas com sucesso!' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
    }
  }
}
