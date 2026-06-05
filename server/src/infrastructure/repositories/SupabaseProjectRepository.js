import { IProjectRepository } from '../../application/interfaces/repositories.js';
import { rowToProject } from './mappers.js';

const SELECT_WITH_TAGS = '*, project_tags(tags(*))';

export class SupabaseProjectRepository extends IProjectRepository {
  constructor(supabase) {
    super();
    this.db = supabase;
  }

  async findByProfileId(profileId) {
    const { data, error } = await this.db
      .from('projects')
      .select(SELECT_WITH_TAGS)
      .eq('profile_id', profileId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data.map(rowToProject);
  }

  async findPublicByUsername(username) {
    // Resolve o profile_id pelo username e traz só os publicados.
    const { data: profile, error: pErr } = await this.db
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!profile) return [];

    const { data, error } = await this.db
      .from('projects')
      .select(SELECT_WITH_TAGS)
      .eq('profile_id', profile.id)
      .eq('status', 'published')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data.map(rowToProject);
  }

  async findBySlug(profileId, slug) {
    const { data, error } = await this.db
      .from('projects')
      .select(SELECT_WITH_TAGS)
      .eq('profile_id', profileId)
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return rowToProject(data);
  }

  async findById(id) {
    const { data, error } = await this.db
      .from('projects')
      .select(SELECT_WITH_TAGS)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return rowToProject(data);
  }

  async create(project, tagIds = []) {
    const { data, error } = await this.db
      .from('projects')
      .insert(project.toPersistence())
      .select('id')
      .single();
    if (error) throw error;

    await this._syncTags(data.id, tagIds);
    return this.findById(data.id);
  }

  async update(id, project, tagIds) {
    const { error } = await this.db
      .from('projects')
      .update(project.toPersistence())
      .eq('id', id);
    if (error) throw error;

    // tagIds undefined => não mexe nas tags. Array (mesmo vazio) => substitui.
    if (tagIds !== undefined) await this._syncTags(id, tagIds);
    return this.findById(id);
  }

  async delete(id) {
    const { error } = await this.db.from('projects').delete().eq('id', id);
    if (error) throw error;
  }

  async reorder(profileId, orderedIds) {
    // Aplica o índice da lista como display_order, garantindo a posse.
    const updates = orderedIds.map((id, index) =>
      this.db
        .from('projects')
        .update({ display_order: index })
        .eq('id', id)
        .eq('profile_id', profileId)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed) throw failed.error;
  }

  async _syncTags(projectId, tagIds) {
    await this.db.from('project_tags').delete().eq('project_id', projectId);
    if (tagIds && tagIds.length > 0) {
      const rows = tagIds.map((tagId) => ({ project_id: projectId, tag_id: tagId }));
      const { error } = await this.db.from('project_tags').insert(rows);
      if (error) throw error;
    }
  }
}
