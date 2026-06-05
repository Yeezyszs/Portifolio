-- =====================================================================
-- DevFolio — endurecimento de segurança (recomendações do linter Supabase)
-- =====================================================================

-- 1. Fixa o search_path das funções (evita hijacking por search_path mutável).
alter function public.handle_new_user() set search_path = public, pg_temp;
alter function public.touch_updated_at() set search_path = public, pg_temp;

-- 2. handle_new_user é SECURITY DEFINER e só deve rodar pelo trigger de signup,
--    nunca ser invocada via RPC público.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- 3. Buckets públicos servem arquivos pela URL direta sem precisar de policy de
--    SELECT em storage.objects. As policies amplas permitiam *listar* todos os
--    arquivos do bucket — removê-las mantém a leitura por URL e bloqueia o list.
drop policy if exists "public read avatars" on storage.objects;
drop policy if exists "public read project covers" on storage.objects;
