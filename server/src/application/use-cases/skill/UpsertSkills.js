import { Skill } from '../../../domain/entities/Skill.js';

// Substitui em massa o conjunto de skills do dono. O frontend envia a lista
// completa e o repositório faz replace-all (delete + insert) numa transação.
export class UpsertSkills {
  constructor({ skillRepository }) {
    this.skillRepo = skillRepository;
  }

  async execute({ userId, skills }) {
    if (!Array.isArray(skills)) {
      throw new Error('skills deve ser um array.');
    }

    // Valida cada skill via entidade antes de persistir.
    const entities = skills.map(
      (s, i) => new Skill({ ...s, profileId: userId, displayOrder: s.displayOrder ?? i })
    );

    return this.skillRepo.replaceAll(userId, entities);
  }
}
