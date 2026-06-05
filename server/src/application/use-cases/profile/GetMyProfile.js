import { NotFoundError } from '../../../domain/errors/errors.js';

// Retorna o perfil do usuário autenticado (inclusive se for privado).
export class GetMyProfile {
  constructor({ profileRepository }) {
    this.profileRepo = profileRepository;
  }

  async execute(userId) {
    const profile = await this.profileRepo.findById(userId);
    if (!profile) throw new NotFoundError('Perfil não encontrado.');
    return profile;
  }
}
