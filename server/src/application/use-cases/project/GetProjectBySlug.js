import { NotFoundError } from '../../../domain/errors/errors.js';

// Detalhe público de um projeto: GET /api/users/:username/projects/:slug
export class GetProjectBySlug {
  constructor({ profileRepository, projectRepository }) {
    this.profileRepo = profileRepository;
    this.projectRepo = projectRepository;
  }

  async execute(username, slug) {
    const profile = await this.profileRepo.findByUsername(username);
    if (!profile || profile.isPublic === false) {
      throw new NotFoundError('Portfólio não encontrado.');
    }

    const project = await this.projectRepo.findBySlug(profile.id, slug);
    if (!project || project.status !== 'published') {
      throw new NotFoundError('Projeto não encontrado.');
    }

    return { profile, project };
  }
}
