import { Project } from '../../../domain/entities/Project.js';
import { ConflictError, NotFoundError } from '../../../domain/errors/errors.js';

export class CreateProject {
  constructor({ projectRepository, profileRepository }) {
    this.projectRepo = projectRepository;
    this.profileRepo = profileRepository;
  }

  async execute({ userId, tagIds = [], ...data }) {
    const profile = await this.profileRepo.findById(userId);
    if (!profile) throw new NotFoundError('Perfil não encontrado.');

    // A entidade gera o slug e valida as invariantes.
    const project = new Project({ ...data, profileId: userId });

    const clash = await this.projectRepo.findBySlug(userId, project.slug);
    if (clash) {
      throw new ConflictError('Você já tem um projeto com esse título/slug.');
    }

    return this.projectRepo.create(project, tagIds);
  }
}
