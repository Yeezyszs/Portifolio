-- =====================================================================
-- DevFolio — Storage buckets + policies
-- Cria os buckets públicos de avatares e capas de projeto.
-- O caminho de cada arquivo deve começar com o id do usuário: <uid>/...
-- =====================================================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('project-covers', 'project-covers', true)
on conflict (id) do nothing;

-- Leitura pública dos dois buckets
create policy "public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "public read project covers"
  on storage.objects for select
  using (bucket_id = 'project-covers');

-- Cada usuário só escreve dentro da sua própria pasta (<uid>/arquivo)
create policy "users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users upload own project cover"
  on storage.objects for insert
  with check (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users update own project cover"
  on storage.objects for update
  using (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete own project cover"
  on storage.objects for delete
  using (
    bucket_id = 'project-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
