import { supabase } from './supabaseClient.js';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

// Wrapper de fetch que injeta o Bearer token automaticamente quando há sessão
// e normaliza erros da API para um Error com mensagem legível.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) headers.Authorization = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.error || `Erro ${res.status}`);
  }
  return data;
}

export const api = {
  // Públicas
  getPublicProfile: (username) => request(`/api/users/${username}`),
  getPublicProject: (username, slug) => request(`/api/users/${username}/projects/${slug}`),
  getTags: () => request('/api/tags'),

  // Privadas
  getMe: () => request('/api/me', { auth: true }),
  updateMe: (body) => request('/api/me', { method: 'PUT', body, auth: true }),
  listMyProjects: () => request('/api/me/projects', { auth: true }),
  createProject: (body) => request('/api/me/projects', { method: 'POST', body, auth: true }),
  updateProject: (id, body) =>
    request(`/api/me/projects/${id}`, { method: 'PUT', body, auth: true }),
  deleteProject: (id) => request(`/api/me/projects/${id}`, { method: 'DELETE', auth: true }),
  reorderProjects: (orderedIds) =>
    request('/api/me/projects/reorder', { method: 'PUT', body: { orderedIds }, auth: true }),
  upsertSkills: (skills) =>
    request('/api/me/skills', { method: 'PUT', body: { skills }, auth: true }),
};
