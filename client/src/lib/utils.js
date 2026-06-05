// Junta classes condicionalmente (mini-clsx).
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

// Gera um gradiente determinístico a partir de uma string (fallback de capa).
export function gradientFromString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 60) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 45%), hsl(${h2} 70% 35%))`;
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
}
