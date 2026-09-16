
export class AppError extends Error {

  public readonly statusCode: number;

  constructor(
    mensagem: string,
    statusCode: number = 500
  ) {
    super(mensagem);

    this.name = 'AppError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(
      this,
      AppError.prototype
    );
  }
}

