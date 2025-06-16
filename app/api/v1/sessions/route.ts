import { NextResponse } from 'next/server'
import * as cookie from 'cookie'

import { UnauthorizedError } from 'infra/errors'

import { authentication, AuthenticationUserData } from 'models/authentication'
import { session } from 'models/session'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userInputValues = body as AuthenticationUserData

    const autehnticatedUser = await authentication.getAuthenticatedUser({
      email: userInputValues?.email,
      password: userInputValues?.password,
    })

    const newSession = await session.create(autehnticatedUser.id)

    const setCookie = cookie.serialize('session_id', newSession.token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    })

    return NextResponse.json(newSession, {
      status: 201,
      headers: {
        'set-cookie': setCookie,
      },
    })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(error, {
        status: error.statusCode,
      })
    }

    return NextResponse.json(error, {
      status: 500,
    })
  }
}
