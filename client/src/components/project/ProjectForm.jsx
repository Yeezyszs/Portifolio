import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Button, Input, Textarea, Badge } from '../ui/index.jsx';
import { cn } from '../../lib/utils.js';

// Formulário de criação/edição de projeto. `project` preenche para edição.
export function ProjectForm({ project, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    title: project?.title ?? '',
    description: project?.description ?? '',
    longDesc: project?.longDesc ?? '',
    repoUrl: project?.repoUrl ?? '',
    liveUrl: project?.liveUrl ?? '',
    coverUrl: project?.coverUrl ?? '',
    status: project?.status ?? 'published',
    tagIds: project?.tags?.map((t) => t.id) ?? [],
  });

  const { data: tags = [] } = useQuery({ queryKey: ['tags'], queryFn: api.getTags });

  function toggleTag(id) {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((t) => t !== id) : [...f.tagIds, id],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Normaliza campos vazios para null (URLs opcionais).
    const payload = {
      ...form,
      description: form.description || null,
      longDesc: form.longDesc || null,
      repoUrl: form.repoUrl || null,
      liveUrl: form.liveUrl || null,
      coverUrl: form.coverUrl || null,
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Título"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Input
        label="Descrição curta"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Textarea
        label="Descrição longa"
        value={form.longDesc}
        onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="URL do repositório"
          value={form.repoUrl}
          onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
        />
        <Input
          label="URL ao vivo"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
        />
      </div>
      <Input
        label="URL da capa"
        value={form.coverUrl}
        onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-text-muted">Tags</span>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => toggleTag(t.id)}
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                form.tagIds.includes(t.id)
                  ? 'border-brand bg-brand/15 text-text'
                  : 'border-border text-text-muted hover:border-brand'
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-text-muted">Status</span>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
