// Reordena os projetos do dono conforme a lista de ids enviada.
export class ReorderProjects {
  constructor({ projectRepository }) {
    this.projectRepo = projectRepository;
  }

  async execute({ userId, orderedIds }) {
    if (!Array.isArray(orderedIds)) {
      throw new Error('orderedIds deve ser um array de ids.');
    }
    await this.projectRepo.reorder(userId, orderedIds);
    return { reordered: true };
  }
}
