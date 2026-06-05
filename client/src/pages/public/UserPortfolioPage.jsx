import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { ProfileHeader } from '../../components/profile/ProfileHeader.jsx';
import { SkillsSection } from '../../components/profile/SkillsSection.jsx';
import { ProjectGrid } from '../../components/project/ProjectGrid.jsx';
import { Spinner } from '../../components/ui/index.jsx';

export function UserPortfolioPage() {
  const { username } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => api.getPublicProfile(username),
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-text-muted">
        <p className="text-lg">Portfólio não encontrado 😕</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <ProfileHeader profile={data.profile} />
      <SkillsSection skills={data.skills} />
      <section className="py-6">
        <h2 className="text-lg font-semibold mb-4">Projetos</h2>
        <ProjectGrid projects={data.projects} username={username} />
      </section>
    </div>
  );
}
