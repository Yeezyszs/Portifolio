// Lista todos os projetos do dono (draft + published + archived).
export class ListMyProjects {
  constructor({ projectRepository }) {
    this.projectRepo = projectRepository;
  }

  async execute(userId) {
    return this.projectRepo.findByProfileId(userId);
  }
}
