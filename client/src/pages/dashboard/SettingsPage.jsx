import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Button, Card, Input, Textarea, Spinner } from '../../components/ui/index.jsx';

export function SettingsPage() {
  const qc = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: api.getMe });
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (me) {
      setForm({
        fullName: me.fullName ?? '',
        bio: me.bio ?? '',
        location: me.location ?? '',
        websiteUrl: me.websiteUrl ?? '',
        avatarUrl: me.avatarUrl ?? '',
        isPublic: me.isPublic ?? true,
      });
    }
  }, [me]);

  const saveMut = useMutation({
    mutationFn: () =>
      api.updateMe({
        ...form,
        bio: form.bio || null,
        location: form.location || null,
        websiteUrl: form.websiteUrl || null,
        avatarUrl: form.avatarUrl || null,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });

  if (isLoading || !form) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>
      <Card className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">
          Username: <strong>@{me.username}</strong> (não pode ser alterado)
        </p>
        <Input
          label="Nome completo"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <Textarea
          label="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Localização"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            label="Website"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          />
        </div>
        <Input
          label="URL do avatar"
          value={form.avatarUrl}
          onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          />
          Portfólio público
        </label>

        <div className="flex justify-end items-center gap-3">
          {saveMut.isSuccess && <span className="text-sm text-green-400">Salvo!</span>}
          {saveMut.error && <span className="text-sm text-red-400">{saveMut.error.message}</span>}
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
