import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const result = await sql`
      SELECT * FROM show WHERE desativado = false AND destaque = true
    `;
    const shows = result.rows; // Acessar o array de resultados

    return NextResponse.json(shows);
  } catch (error) {
    console.error('Error fetching featured shows:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
}
