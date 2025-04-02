/* eslint-disable @typescript-eslint/no-explicit-any */
export class InternalServerError extends Error {
  action: string
  statusCode: number

  constructor({
    cause,
    statusCode,
  }: {
    cause: Error | undefined | any
    statusCode?: number
  }) {
    super('Internal Server Error', { cause })

    this.name = 'InternalServerError'
    this.action = 'Try again later'
    this.statusCode = statusCode || 500
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class ServiceError extends Error {
  action: string
  statusCode: number

  constructor({ cause, message }) {
    super(message || 'Service unavailable', {
      cause,
    })

    this.name = 'ServiceError'
    this.action = 'Verifique se o serviço está disponível.'
    this.statusCode = 503
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class MethodNotAllowedError extends Error {
  action: string
  statusCode: number

  constructor() {
    super('Method Not Allowed')

    this.name = 'MethodNotAllowedError'
    this.action = 'Try again later'
    this.statusCode = 405
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}
