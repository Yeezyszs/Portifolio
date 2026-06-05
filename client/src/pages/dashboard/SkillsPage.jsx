import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Button, Card, Input, Spinner } from '../../components/ui/index.jsx';

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

export function SkillsPage() {
  const qc = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: api.getMe });
  const profileQuery = useQuery({
    queryKey: ['public-profile-self', me?.username],
    queryFn: () => api.getPublicProfile(me.username),
    enabled: !!me?.username,
  });

  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (profileQuery.data?.skills) setSkills(profileQuery.data.skills);
  }, [profileQuery.data]);

  const saveMut = useMutation({
    mutationFn: () =>
      api.upsertSkills(
        skills.map((s, i) => ({
          name: s.name,
          level: s.level,
          category: s.category || null,
          displayOrder: i,
        }))
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['public-profile-self'] }),
  });

  function update(i, patch) {
    setSkills((s) => s.map((sk, idx) => (idx === i ? { ...sk, ...patch } : sk)));
  }
  function add() {
    setSkills((s) => [...s, { name: '', level: 'intermediate', category: '' }]);
  }
  function remove(i) {
    setSkills((s) => s.filter((_, idx) => idx !== i));
  }

  if (isLoading || profileQuery.isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Skills</h1>
      <Card className="flex flex-col gap-3">
        {skills.map((s, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5">
              <Input
                label={i === 0 ? 'Nome' : undefined}
                placeholder="React"
                value={s.name}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </div>
            <div className="col-span-4">
              <Input
                label={i === 0 ? 'Categoria' : undefined}
                placeholder="Frontend"
                value={s.category || ''}
                onChange={(e) => update(i, { category: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="flex flex-col gap-1.5">
                {i === 0 && <span className="text-sm text-text-muted">Nível</span>}
                <select
                  value={s.level}
                  onChange={(e) => update(i, { level: e.target.value })}
                  className="rounded-lg border border-border bg-surface px-2 py-2 text-sm outline-none focus:border-brand"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="col-span-1 h-9 text-text-muted hover:text-red-400"
              title="Remover"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={add}>
            + Adicionar skill
          </Button>
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? 'Salvando...' : 'Salvar skills'}
          </Button>
        </div>
        {saveMut.isSuccess && <p className="text-sm text-green-400">Salvo!</p>}
      </Card>
    </div>
  );
}
