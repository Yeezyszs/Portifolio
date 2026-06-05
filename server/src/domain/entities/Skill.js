import { ValidationError } from '../errors/errors.js';

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

// Entidade pura de Skill.
export class Skill {
  constructor({
    id = null,
    profileId,
    name,
    level = 'intermediate',
    category = null,
    displayOrder = 0,
  }) {
    this.id = id;
    this.profileId = profileId;
    this.name = name;
    this.level = level;
    this.category = category;
    this.displayOrder = displayOrder;

    this.validate();
  }

  validate() {
    if (!this.profileId) {
      throw new ValidationError('Skill precisa de um dono (profileId).');
    }
    if (!this.name || this.name.trim().length < 1) {
      throw new ValidationError('Nome da skill é obrigatório.');
    }
    if (!LEVELS.includes(this.level)) {
      throw new ValidationError(`Nível inválido. Use: ${LEVELS.join(', ')}.`);
    }
  }

  toPersistence() {
    return {
      profile_id: this.profileId,
      name: this.name,
      level: this.level,
      category: this.category,
      display_order: this.displayOrder,
    };
  }
}
