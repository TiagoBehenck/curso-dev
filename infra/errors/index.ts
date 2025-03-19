/* eslint-disable @typescript-eslint/no-explicit-any */
export class InternalServerError extends Error {
  action: string
  statusCode: number

  constructor({ cause }: { cause: Error | undefined | any }) {
    super('Internal Server Error', { cause })

    this.name = 'InternalServerError'
    this.action = 'Try again later'
    this.statusCode = 500
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
