// Erros de domínio. Cada um carrega um statusCode HTTP para que o
// errorHandler da camada de apresentação traduza sem conhecer regras de negócio.

export class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends DomainError {
  constructor(message) {
    super(message, 422);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'Acesso negado') {
    super(message, 403);
  }
}

export class ConflictError extends DomainError {
  constructor(message = 'Conflito de dados') {
    super(message, 409);
  }
}
