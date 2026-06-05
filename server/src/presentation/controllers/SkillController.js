import { z } from 'zod';
import { asyncHandler } from '../middlewares/errorHandler.js';

const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1).max(60),
      level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
      category: z.string().max(40).nullable().optional(),
      displayOrder: z.number().int().optional(),
    })
  ),
});

export class SkillController {
  constructor({ upsertSkills, listTags }) {
    this.upsertSkills = upsertSkills;
    this.listTags = listTags;
  }

  // PUT /api/me/skills  (privado)
  upsert = asyncHandler(async (req, res) => {
    const { skills } = skillsSchema.parse(req.body);
    const saved = await this.upsertSkills.execute({ userId: req.user.id, skills });
    res.json(saved);
  });

  // GET /api/tags  (público)
  tags = asyncHandler(async (_req, res) => {
    const tags = await this.listTags.execute();
    res.json(tags);
  });
}
