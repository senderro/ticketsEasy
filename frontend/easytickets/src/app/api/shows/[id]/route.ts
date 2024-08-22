import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idShow = parseInt(url.pathname.split('/').pop() || '0', 10);

  try {
    // Obter dados do show
    const showResult = await sql`
      SELECT * FROM show WHERE idShow = ${idShow}
    `;
    const show = showResult.rows[0]; // Acessar o primeiro item do array de resultados

    // Obter tipos de cadeira
    const tiposDeCadeiraResult = await sql`
      SELECT * FROM tipoCadeira WHERE idEstrangeiraShow = ${idShow}
    `;
    const tiposDeCadeira = tiposDeCadeiraResult.rows; // Acessar o array de resultados

    return NextResponse.json({ ...show, tiposDeCadeira });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
    }
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const idShow = parseInt(url.pathname.split('/').pop() || '0', 10);
  const body = await request.json();
  try {
    // Atualizar dados do show
    await sql`
      UPDATE show SET
        nomeShow = ${body.nomeshow},
        descricao = ${body.descricao},
        dataShow = ${body.datashow},
        artistas = ${body.artistas},
        destaque = ${body.destaque}
      WHERE idShow = ${idShow}
    `;

    // Remover tipos de cadeira antigos
    await sql`DELETE FROM tipoCadeira WHERE idEstrangeiraShow = ${idShow}`;
    
    // Inserir novos tipos de cadeira
    for (const tipo of body.tiposDeCadeira) {
      await sql`
        INSERT INTO tipoCadeira (idEstrangeiraShow, nomeTipoCadeira, quantidadeDisponiveis, quantidadeCompradas, preco, temMeia)
        VALUES (${idShow}, ${tipo.nometipocadeira}, ${tipo.quantidadedisponiveis}, ${tipo.quantidadecompradas}, ${tipo.preco}, ${tipo.temmeia})
      `;
    }

    return NextResponse.json({ message: 'Show atualizado com sucesso!' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
    }
  }
}
