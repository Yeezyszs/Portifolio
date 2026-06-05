import { z } from 'zod';
import { asyncHandler } from '../middlewares/errorHandler.js';

const baseProject = {
  title: z.string().min(2).max(120),
  description: z.string().max(280).nullable().optional(),
  longDesc: z.string().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  repoUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
};

const createSchema = z.object(baseProject);
const updateSchema = z.object({ ...baseProject, title: baseProject.title.optional() });
const reorderSchema = z.object({ orderedIds: z.array(z.string().uuid()) });

export class ProjectController {
  constructor({
    createProject,
    updateProject,
    deleteProject,
    listMyProjects,
    getProjectBySlug,
    reorderProjects,
  }) {
    this.createProject = createProject;
    this.updateProject = updateProject;
    this.deleteProject = deleteProject;
    this.listMyProjects = listMyProjects;
    this.getProjectBySlug = getProjectBySlug;
    this.reorderProjects = reorderProjects;
  }

  // GET /api/users/:username/projects/:slug  (público)
  publicBySlug = asyncHandler(async (req, res) => {
    const { username, slug } = req.params;
    const result = await this.getProjectBySlug.execute(username, slug);
    res.json(result);
  });

  // GET /api/me/projects  (privado)
  listMine = asyncHandler(async (req, res) => {
    const projects = await this.listMyProjects.execute(req.user.id);
    res.json(projects);
  });

  // POST /api/me/projects  (privado)
  create = asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const project = await this.createProject.execute({ userId: req.user.id, ...data });
    res.status(201).json(project);
  });

  // PUT /api/me/projects/:id  (privado)
  update = asyncHandler(async (req, res) => {
    const data = updateSchema.parse(req.body);
    const project = await this.updateProject.execute({
      userId: req.user.id,
      projectId: req.params.id,
      ...data,
    });
    res.json(project);
  });

  // PUT /api/me/projects/reorder  (privado)
  reorder = asyncHandler(async (req, res) => {
    const { orderedIds } = reorderSchema.parse(req.body);
    const result = await this.reorderProjects.execute({ userId: req.user.id, orderedIds });
    res.json(result);
  });

  // DELETE /api/me/projects/:id  (privado)
  remove = asyncHandler(async (req, res) => {
    const result = await this.deleteProject.execute({
      userId: req.user.id,
      projectId: req.params.id,
    });
    res.json(result);
  });
}
