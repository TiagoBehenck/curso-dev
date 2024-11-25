import database from 'infra/database'
import { NextResponse } from 'next/server'


export async function GET() {
  const result = await database.query('SELECT 1 + 1;')

  return NextResponse.json({ message: 'alunos do curso.dev são pessoas acima da média!' }, { status: 200 })
}
