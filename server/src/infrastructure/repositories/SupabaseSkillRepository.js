import { ISkillRepository } from '../../application/interfaces/repositories.js';
import { rowToSkill } from './mappers.js';

export class SupabaseSkillRepository extends ISkillRepository {
  constructor(supabase) {
    super();
    this.db = supabase;
  }

  async findByProfileId(profileId) {
    const { data, error } = await this.db
      .from('skills')
      .select('*')
      .eq('profile_id', profileId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data.map(rowToSkill);
  }

  // Replace-all: remove as skills antigas e insere o novo conjunto.
  async replaceAll(profileId, skills) {
    const { error: delErr } = await this.db
      .from('skills')
      .delete()
      .eq('profile_id', profileId);
    if (delErr) throw delErr;

    if (skills.length === 0) return [];

    const { data, error } = await this.db
      .from('skills')
      .insert(skills.map((s) => s.toPersistence()))
      .select('*');
    if (error) throw error;
    return data.map(rowToSkill);
  }
}
