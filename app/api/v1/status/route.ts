import { NextResponse } from 'next/server'

export  async function GET() {
  return NextResponse.json({ message: 'alunos do curso.dev são pessoas acima da média!' }, { status: 200 })
}
