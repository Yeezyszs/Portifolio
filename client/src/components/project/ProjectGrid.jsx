import { ProjectCard } from './ProjectCard.jsx';

export function ProjectGrid({ projects, username }) {
  if (!projects?.length) {
    return <p className="text-text-muted text-center py-10">Nenhum projeto publicado ainda.</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} username={username} />
      ))}
    </div>
  );
}
