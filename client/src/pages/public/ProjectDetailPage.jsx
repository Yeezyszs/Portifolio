import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { Badge, Button, Spinner } from '../../components/ui/index.jsx';
import { gradientFromString } from '../../lib/utils.js';

export function ProjectDetailPage() {
  const { username, slug } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['project', username, slug],
    queryFn: () => api.getPublicProject(username, slug),
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-center py-20 text-text-muted">Projeto não encontrado 😕</p>;
  }

  const { project } = data;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to={`/u/${username}`} className="text-sm text-brand">
        ← voltar para o portfólio
      </Link>

      <div
        className="mt-4 h-56 w-full rounded-card bg-cover bg-center"
        style={
          project.coverUrl
            ? { backgroundImage: `url(${project.coverUrl})` }
            : { background: gradientFromString(project.slug) }
        }
      />

      <h1 className="text-3xl font-bold mt-6">{project.title}</h1>
      {project.description && <p className="text-text-muted mt-2">{project.description}</p>}

      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((t) => (
            <Badge key={t.id} color={t.color}>
              {t.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            <Button variant="outline">Repositório</Button>
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            <Button>Ver ao vivo</Button>
          </a>
        )}
      </div>

      {project.longDesc && (
        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-text">
          {project.longDesc}
        </div>
      )}
    </article>
  );
}
