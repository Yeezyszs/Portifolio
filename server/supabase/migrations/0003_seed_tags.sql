-- =====================================================================
-- DevFolio — seed do catálogo global de tags
-- =====================================================================

insert into public.tags (name, slug, color) values
  ('React',      'react',      '#61dafb'),
  ('Vue',        'vue',        '#42b883'),
  ('Angular',    'angular',    '#dd0031'),
  ('Node.js',    'nodejs',     '#3c873a'),
  ('TypeScript', 'typescript', '#3178c6'),
  ('JavaScript', 'javascript', '#f7df1e'),
  ('Python',     'python',     '#3776ab'),
  ('Go',         'go',         '#00add8'),
  ('Rust',       'rust',       '#dea584'),
  ('PostgreSQL', 'postgresql', '#336791'),
  ('MongoDB',    'mongodb',    '#47a248'),
  ('Docker',     'docker',     '#2496ed'),
  ('Tailwind',   'tailwind',   '#06b6d4'),
  ('Next.js',    'nextjs',     '#000000'),
  ('GraphQL',    'graphql',    '#e10098')
on conflict (slug) do nothing;
