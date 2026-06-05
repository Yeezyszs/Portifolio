// Contratos que os use cases conhecem. A infraestrutura (Supabase) implementa
// estes métodos. Trocar o banco = criar novas implementações destas interfaces
// e mudar uma linha no Composition Root (app.js). Os use cases não mudam.

export class IProfileRepository {
  async findById(_id) { throw new Error('not implemented'); }
  async findByUsername(_username) { throw new Error('not implemented'); }
  async update(_id, _data) { throw new Error('not implemented'); }
}

export class IProjectRepository {
  async findByProfileId(_profileId, _options) { throw new Error('not implemented'); }
  async findPublicByUsername(_username, _options) { throw new Error('not implemented'); }
  async findBySlug(_profileId, _slug) { throw new Error('not implemented'); }
  async findById(_id) { throw new Error('not implemented'); }
  async create(_project, _tagIds) { throw new Error('not implemented'); }
  async update(_id, _data, _tagIds) { throw new Error('not implemented'); }
  async delete(_id) { throw new Error('not implemented'); }
  async reorder(_profileId, _orderedIds) { throw new Error('not implemented'); }
}

export class ISkillRepository {
  async findByProfileId(_profileId) { throw new Error('not implemented'); }
  async replaceAll(_profileId, _skills) { throw new Error('not implemented'); }
}

export class ITagRepository {
  async findAll() { throw new Error('not implemented'); }
}
