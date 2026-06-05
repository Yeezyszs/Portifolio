import { ZodError } from 'zod';
import { DomainError } from '../../domain/errors/errors.js';

// Tradutor central de erros -> HTTP. Mantém os controllers limpos de try/catch.
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'Dados inválidos.',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  if (err instanceof DomainError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Erros do Postgres/Supabase com código de violação de unicidade.
  if (err?.code === '23505') {
    return res.status(409).json({ error: 'Registro duplicado.' });
  }

  console.error('[unhandled error]', err);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}

// Captura rejeições em handlers async sem precisar de try/catch em cada um.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
