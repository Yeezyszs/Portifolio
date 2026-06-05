import { Project } from '../../../domain/entities/Project.js';
import { ForbiddenError, NotFoundError } from '../../../domain/errors/errors.js';

export class UpdateProject {
  constructor({ projectRepository }) {
    this.projectRepo = projectRepository;
  }

  async execute({ userId, projectId, tagIds, ...data }) {
    const existing = await this.projectRepo.findById(projectId);
    if (!existing) throw new NotFoundError('Projeto não encontrado.');
    if (existing.profileId !== userId) {
      throw new ForbiddenError('Você não pode editar este projeto.');
    }

    // Reconstrói a entidade mesclando o atual com o patch — revalida tudo.
    const merged = new Project({
      ...existing,
      ...data,
      // Se o título mudou e o slug não foi enviado, regenera o slug.
      slug: data.slug ?? (data.title ? Project.slugFromTitle(data.title) : existing.slug),
      profileId: userId,
      id: projectId,
    });

    return this.projectRepo.update(projectId, merged, tagIds);
  }
}
