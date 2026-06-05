import { Profile } from '../../../domain/entities/Profile.js';
import { NotFoundError } from '../../../domain/errors/errors.js';

// Atualiza campos editáveis do perfil. username é imutável e ignorado aqui.
export class UpdateProfile {
  constructor({ profileRepository }) {
    this.profileRepo = profileRepository;
  }

  async execute(userId, data) {
    Profile.validateUpdate(data);

    const existing = await this.profileRepo.findById(userId);
    if (!existing) throw new NotFoundError('Perfil não encontrado.');

    const patch = {};
    for (const field of ['fullName', 'bio', 'avatarUrl', 'location', 'websiteUrl', 'isPublic']) {
      if (data[field] !== undefined) patch[field] = data[field];
    }

    return this.profileRepo.update(userId, patch);
  }
}
