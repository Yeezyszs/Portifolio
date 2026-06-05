import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Button, Card, Badge, Spinner } from '../../components/ui/index.jsx';
import { ProjectForm } from '../../components/project/ProjectForm.jsx';

const statusLabel = { draft: 'Rascunho', published: 'Publicado', archived: 'Arquivado' };

export function ProjectsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null | 'new' | project
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: api.listMyProjects,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['my-projects'] });

  const createMut = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }) => api.updateProject(id, body),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });
  const deleteMut = useMutation({ mutationFn: api.deleteProject, onSuccess: invalidate });

  function handleSubmit(payload) {
    if (editing === 'new') createMut.mutate(payload);
    else updateMut.mutate({ id: editing.id, body: payload });
  }

  if (isLoading) return <Spinner />;

  if (editing) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">
          {editing === 'new' ? 'Novo projeto' : 'Editar projeto'}
        </h1>
        <Card>
          <ProjectForm
            project={editing === 'new' ? null : editing}
            saving={createMut.isPending || updateMut.isPending}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
          {(createMut.error || updateMut.error) && (
            <p className="text-sm text-red-400 mt-3">
              {(createMut.error || updateMut.error).message}
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <Button onClick={() => setEditing('new')}>+ Novo projeto</Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center text-text-muted py-10">
          Você ainda não tem projetos. Crie o primeiro!
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{p.title}</p>
                  <Badge>{statusLabel[p.status]}</Badge>
                </div>
                {p.description && (
                  <p className="text-sm text-text-muted truncate">{p.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" onClick={() => setEditing(p)}>
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Remover "${p.title}"?`)) deleteMut.mutate(p.id);
                  }}
                >
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
