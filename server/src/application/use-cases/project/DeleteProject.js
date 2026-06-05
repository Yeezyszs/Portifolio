import { ForbiddenError, NotFoundError } from '../../../domain/errors/errors.js';

export class DeleteProject {
  constructor({ projectRepository }) {
    this.projectRepo = projectRepository;
  }

  async execute({ userId, projectId }) {
    const existing = await this.projectRepo.findById(projectId);
    if (!existing) throw new NotFoundError('Projeto não encontrado.');
    if (existing.profileId !== userId) {
      throw new ForbiddenError('Você não pode remover este projeto.');
    }
    await this.projectRepo.delete(projectId);
    return { deleted: true };
  }
}
