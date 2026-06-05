import slugify from 'slugify';
import { ValidationError } from '../errors/errors.js';

const STATUSES = ['draft', 'published', 'archived'];

// Entidade pura de Projeto. Gera o próprio slug e valida suas invariantes.
export class Project {
  constructor({
    id = null,
    profileId,
    title,
    slug = null,
    description = null,
    longDesc = null,
    coverUrl = null,
    repoUrl = null,
    liveUrl = null,
    status = 'published',
    featured = false,
    displayOrder = 0,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.profileId = profileId;
    this.title = title;
    this.slug = slug || Project.slugFromTitle(title);
    this.description = description;
    this.longDesc = longDesc;
    this.coverUrl = coverUrl;
    this.repoUrl = repoUrl;
    this.liveUrl = liveUrl;
    this.status = status;
    this.featured = featured;
    this.displayOrder = displayOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  static slugFromTitle(title) {
    return slugify(String(title || ''), { lower: true, strict: true });
  }

  validate() {
    if (!this.profileId) {
      throw new ValidationError('Projeto precisa de um dono (profileId).');
    }
    if (!this.title || this.title.trim().length < 2) {
      throw new ValidationError('Título deve ter ao menos 2 caracteres.');
    }
    if (!this.slug) {
      throw new ValidationError('Não foi possível gerar um slug a partir do título.');
    }
    if (!STATUSES.includes(this.status)) {
      throw new ValidationError(`Status inválido. Use: ${STATUSES.join(', ')}.`);
    }
    for (const [field, value] of [['repoUrl', this.repoUrl], ['liveUrl', this.liveUrl]]) {
      if (value) {
        try {
          new URL(value);
        } catch {
          throw new ValidationError(`${field} deve ser uma URL válida.`);
        }
      }
    }
  }

  canBeEditedBy(userId) {
    return this.profileId === userId;
  }

  // Converte para o formato de coluna do banco (snake_case).
  toPersistence() {
    return {
      profile_id: this.profileId,
      title: this.title,
      slug: this.slug,
      description: this.description,
      long_desc: this.longDesc,
      cover_url: this.coverUrl,
      repo_url: this.repoUrl,
      live_url: this.liveUrl,
      status: this.status,
      featured: this.featured,
      display_order: this.displayOrder,
    };
  }
}
