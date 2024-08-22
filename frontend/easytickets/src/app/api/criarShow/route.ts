import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nomeShow, descricao, dataShow, artistas, tiposDeCadeira } = await request.json();

    // Validação das informações do show
    if (!nomeShow || typeof nomeShow !== 'string' || nomeShow.trim() === '') {
      throw new Error('O nome do show é obrigatório e deve ser uma string válida.');
    }

    if (!dataShow || isNaN(Date.parse(dataShow))) {
      throw new Error('A data do show é obrigatória e deve ser uma data válida.');
    }

    if (!artistas || typeof artistas !== 'string' || artistas.trim() === '') {
      throw new Error('Pelo menos um artista é obrigatório e deve ser uma string válida.');
    }

    // Validação dos tipos de cadeira
    if (!Array.isArray(tiposDeCadeira) || tiposDeCadeira.length === 0) {
      throw new Error('É necessário fornecer pelo menos um tipo de cadeira.');
    }

    tiposDeCadeira.forEach((tipo, index) => {
      if (!tipo.nomeTipoCadeira || typeof tipo.nomeTipoCadeira !== 'string' || tipo.nomeTipoCadeira.trim() === '') {
        throw new Error(`O nome do tipo de cadeira na posição ${index + 1} é obrigatório e deve ser uma string válida.`);
      }

      if (typeof tipo.quantidadeDisponiveis !== 'number' || tipo.quantidadeDisponiveis <= 0) {
        throw new Error(`A quantidade disponível do tipo de cadeira na posição ${index + 1} deve ser um número maior que 0.`);
      }

      if (typeof tipo.preco !== 'number' || tipo.preco <= 0) {
        throw new Error(`O preço do tipo de cadeira na posição ${index + 1} deve ser um número maior que 0.`);
      }
    });

    // Inserção do show na tabela
    const showResult = await sql`
      INSERT INTO show (nomeShow, descricao, dataShow, artistas, destaque)
      VALUES (${nomeShow}, ${descricao}, ${dataShow}, ${artistas}, false)
      RETURNING idShow;
    `;

    const showId = showResult.rows[0].idshow;

    // Inserção dos tipos de cadeira na tabela
    for (const tipo of tiposDeCadeira) {
      await sql`
        INSERT INTO tipoCadeira (idEstrangeiraShow, nomeTipoCadeira, quantidadeDisponiveis, quantidadeCompradas, preco, temMeia)
        VALUES (${showId}, ${tipo.nomeTipoCadeira}, ${tipo.quantidadeDisponiveis}, ${tipo.quantidadeCompradas}, ${tipo.preco}, ${tipo.temMeia});
      `;
    }

    return NextResponse.json({ message: 'Show e tipos de cadeiras adicionados com sucesso!' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
    }
  }
}
