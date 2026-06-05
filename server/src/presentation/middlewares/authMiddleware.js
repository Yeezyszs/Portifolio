import { supabase } from '../../infrastructure/database/supabaseClient.js';

// Valida o JWT do Supabase enviado como `Authorization: Bearer <token>`.
// Em sucesso, injeta req.user = { id, email }.
export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação ausente.' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }

  req.user = { id: data.user.id, email: data.user.email };
  next();
}
