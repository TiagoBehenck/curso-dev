import { NextResponse } from 'next/server'
import database from '../../../../infra/database'

export async function GET() {
  const result = await database.query('SELECT 1 + 1;')

  console.log(result)
  return NextResponse.json({ message: 'alunos do curso.dev são pessoas acima da média!' }, { status: 200 })
}
