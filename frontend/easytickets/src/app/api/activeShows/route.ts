import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('query') || '';
  const orderBy = url.searchParams.get('orderBy') || 'datashow';
  const orderDirection = url.searchParams.get('orderDirection') === 'desc' ? 'DESC' : 'ASC';

  try {
    // Construir a consulta com SQL dinâmico, separando os parâmetros dinâmicos de segurança
    const query = `
      SELECT * FROM show 
      WHERE desativado = false 
        AND nomeshow ILIKE $1
      ORDER BY ${orderBy} ${orderDirection}
    `;

    const result = await sql.query(query, [`%${searchQuery}%`]);

    const shows = result.rows; // Acessar o array de resultados

    return NextResponse.json(shows);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
    }
  }
}
