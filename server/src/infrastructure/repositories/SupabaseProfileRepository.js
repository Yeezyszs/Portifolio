import { IProfileRepository } from '../../application/interfaces/repositories.js';
import { profilePatchToRow, rowToProfile } from './mappers.js';

export class SupabaseProfileRepository extends IProfileRepository {
  constructor(supabase) {
    super();
    this.db = supabase;
  }

  async findById(id) {
    const { data, error } = await this.db
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return rowToProfile(data);
  }

  async findByUsername(username) {
    const { data, error } = await this.db
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;
    return rowToProfile(data);
  }

  async update(id, patch) {
    const { data, error } = await this.db
      .from('profiles')
      .update(profilePatchToRow(patch))
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return rowToProfile(data);
  }
}
