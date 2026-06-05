import { Link } from 'react-router-dom';
import { Badge } from '../ui/index.jsx';
import { gradientFromString } from '../../lib/utils.js';

export function ProjectCard({ project, username }) {
  const inner = (
    <article className="group rounded-card border border-border bg-surface overflow-hidden transition-colors hover:border-brand">
      <div
        className="h-36 w-full bg-cover bg-center"
        style={
          project.coverUrl
            ? { backgroundImage: `url(${project.coverUrl})` }
            : { background: gradientFromString(project.slug) }
        }
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold group-hover:text-brand">{project.title}</h3>
        {project.description && (
          <p className="text-sm text-text-muted line-clamp-2">{project.description}</p>
        )}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((t) => (
              <Badge key={t.id} color={t.color}>
                {t.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  // Na vitrine pública o card é clicável para a página de detalhe.
  return username ? <Link to={`/u/${username}/${project.slug}`}>{inner}</Link> : inner;
}
