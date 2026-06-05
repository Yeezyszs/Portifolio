import { z } from 'zod';
import { asyncHandler } from '../middlewares/errorHandler.js';

const updateSchema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  bio: z.string().max(500).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  location: z.string().max(80).nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  isPublic: z.boolean().optional(),
});

export class ProfileController {
  constructor({ getProfileByUsername, getMyProfile, updateProfile }) {
    this.getProfileByUsername = getProfileByUsername;
    this.getMyProfile = getMyProfile;
    this.updateProfile = updateProfile;
  }

  // GET /api/users/:username  (público)
  publicByUsername = asyncHandler(async (req, res) => {
    const result = await this.getProfileByUsername.execute(req.params.username);
    res.json(result);
  });

  // GET /api/me  (privado)
  me = asyncHandler(async (req, res) => {
    const profile = await this.getMyProfile.execute(req.user.id);
    res.json(profile);
  });

  // PUT /api/me  (privado)
  update = asyncHandler(async (req, res) => {
    const data = updateSchema.parse(req.body);
    const updated = await this.updateProfile.execute(req.user.id, data);
    res.json(updated);
  });
}
