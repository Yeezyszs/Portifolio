import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Card, Button, Spinner } from '../../components/ui/index.jsx';

export function DashboardHome() {
  const [copied, setCopied] = useState(false);
  const profileQuery = useQuery({ queryKey: ['me'], queryFn: api.getMe });
  const projectsQuery = useQuery({ queryKey: ['my-projects'], queryFn: api.listMyProjects });

  if (profileQuery.isLoading) {
    return <Spinner />;
  }

  const profile = profileQuery.data;
  const projects = projectsQuery.data ?? [];
  const publicUrl = `${window.location.origin}/u/${profile.username}`;
  const published = projects.filter((p) => p.status === 'published').length;

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {profile.fullName.split(' ')[0]} 👋</h1>
        <p className="text-text-muted">Aqui está o resumo do seu portfólio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-3xl font-bold text-brand">{projects.length}</p>
          <p className="text-sm text-text-muted">Projetos no total</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-brand">{published}</p>
          <p className="text-sm text-text-muted">Publicados</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-brand">@{profile.username}</p>
          <p className="text-sm text-text-muted">Seu username</p>
        </Card>
      </div>

      <Card className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-medium">Seu link público</p>
          <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-brand">
            {publicUrl}
          </a>
        </div>
        <Button variant="outline" onClick={copyLink}>
          {copied ? 'Copiado!' : 'Copiar link'}
        </Button>
      </Card>
    </div>
  );
}
