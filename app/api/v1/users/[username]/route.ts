import { NextResponse } from 'next/server'

import { user } from 'models/user'
import { NotFoundError } from 'infra/errors'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const userFound = await user.findOneByUsername(username)

    return NextResponse.json(userFound, {
      status: 200,
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(error, {
        status: error.statusCode,
      })
    }

    return NextResponse.json(error, {
      status: 500,
    })
  }
}
