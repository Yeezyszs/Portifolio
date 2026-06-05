import { ValidationError } from '../errors/errors.js';

const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

// Entidade pura: conhece apenas as regras de negócio do perfil de um dev.
// Não sabe nada sobre HTTP, banco de dados ou Supabase.
export class Profile {
  constructor({
    id,
    username,
    fullName,
    bio = null,
    avatarUrl = null,
    location = null,
    websiteUrl = null,
    isPublic = true,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.username = username;
    this.fullName = fullName;
    this.bio = bio;
    this.avatarUrl = avatarUrl;
    this.location = location;
    this.websiteUrl = websiteUrl;
    this.isPublic = isPublic;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static validateUsername(username) {
    if (!username || !USERNAME_RE.test(username)) {
      throw new ValidationError(
        'Username deve ter 3-30 caracteres, apenas letras minúsculas, números e hífens.'
      );
    }
  }

  // Valida os campos editáveis de um perfil (username é imutável após criação).
  static validateUpdate({ fullName, bio, websiteUrl }) {
    if (fullName !== undefined && (!fullName || fullName.trim().length < 2)) {
      throw new ValidationError('Nome completo deve ter ao menos 2 caracteres.');
    }
    if (bio !== undefined && bio !== null && bio.length > 500) {
      throw new ValidationError('Bio não pode exceder 500 caracteres.');
    }
    if (websiteUrl) {
      try {
        new URL(websiteUrl);
      } catch {
        throw new ValidationError('Website deve ser uma URL válida.');
      }
    }
  }
}
