import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Cria a tabela "show"
    await sql`
      CREATE TABLE IF NOT EXISTS show (
        idShow SERIAL PRIMARY KEY,
        nomeShow VARCHAR(255) NOT NULL,
        descricao VARCHAR(255),
        dataShow DATE NOT NULL,
        artistas VARCHAR(255),
        destaque BOOLEAN
      );
    `;

    // Cria a tabela "tipoCadeira"
    await sql`
      CREATE TABLE IF NOT EXISTS tipoCadeira (
        idTipoCadeira SERIAL PRIMARY KEY,
        idEstrangeiraShow INT REFERENCES show(idShow),
        nomeTipoCadeira VARCHAR(255) NOT NULL,
        quantidadeDisponiveis INT NOT NULL,
        quantidadeCompradas INT DEFAULT 0,
        preco FLOAT NOT NULL,
        temMeia BOOLEAN
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
