// Mapeiam linhas do banco (snake_case) para o formato usado pela aplicação
// (camelCase). Mantém o resto do código livre de detalhes de coluna.

export function rowToProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    location: row.location,
    websiteUrl: row.website_url,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowToProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    profileId: row.profile_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    longDesc: row.long_desc,
    coverUrl: row.cover_url,
    repoUrl: row.repo_url,
    liveUrl: row.live_url,
    status: row.status,
    featured: row.featured,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: (row.project_tags ?? []).map((pt) => pt.tags).filter(Boolean),
  };
}

export function rowToSkill(row) {
  if (!row) return null;
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    level: row.level,
    category: row.category,
    displayOrder: row.display_order,
  };
}

export function profilePatchToRow(patch) {
  const row = {};
  if (patch.fullName !== undefined) row.full_name = patch.fullName;
  if (patch.bio !== undefined) row.bio = patch.bio;
  if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;
  if (patch.location !== undefined) row.location = patch.location;
  if (patch.websiteUrl !== undefined) row.website_url = patch.websiteUrl;
  if (patch.isPublic !== undefined) row.is_public = patch.isPublic;
  return row;
}
