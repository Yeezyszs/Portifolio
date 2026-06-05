import { ITagRepository } from '../../application/interfaces/repositories.js';

export class SupabaseTagRepository extends ITagRepository {
  constructor(supabase) {
    super();
    this.db = supabase;
  }

  async findAll() {
    const { data, error } = await this.db
      .from('tags')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }
}
