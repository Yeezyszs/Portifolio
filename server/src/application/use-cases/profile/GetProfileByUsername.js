import { NotFoundError } from '../../../domain/errors/errors.js';

// Monta o portfólio público completo de um dev: perfil + skills + projetos
// publicados. Consumido pela rota pública GET /api/users/:username.
export class GetProfileByUsername {
  constructor({ profileRepository, skillRepository, projectRepository }) {
    this.profileRepo = profileRepository;
    this.skillRepo = skillRepository;
    this.projectRepo = projectRepository;
  }

  async execute(username) {
    const profile = await this.profileRepo.findByUsername(username);
    if (!profile || profile.isPublic === false) {
      throw new NotFoundError('Portfólio não encontrado.');
    }

    const [skills, projects] = await Promise.all([
      this.skillRepo.findByProfileId(profile.id),
      this.projectRepo.findPublicByUsername(username),
    ]);

    return { profile, skills, projects };
  }
}
