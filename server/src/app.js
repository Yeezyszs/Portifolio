import cors from 'cors';
import express from 'express';

import { supabase } from './infrastructure/database/supabaseClient.js';
import { SupabaseProfileRepository } from './infrastructure/repositories/SupabaseProfileRepository.js';
import { SupabaseProjectRepository } from './infrastructure/repositories/SupabaseProjectRepository.js';
import { SupabaseSkillRepository } from './infrastructure/repositories/SupabaseSkillRepository.js';
import { SupabaseTagRepository } from './infrastructure/repositories/SupabaseTagRepository.js';

import { GetProfileByUsername } from './application/use-cases/profile/GetProfileByUsername.js';
import { GetMyProfile } from './application/use-cases/profile/GetMyProfile.js';
import { UpdateProfile } from './application/use-cases/profile/UpdateProfile.js';
import { CreateProject } from './application/use-cases/project/CreateProject.js';
import { UpdateProject } from './application/use-cases/project/UpdateProject.js';
import { DeleteProject } from './application/use-cases/project/DeleteProject.js';
import { ListMyProjects } from './application/use-cases/project/ListMyProjects.js';
import { GetProjectBySlug } from './application/use-cases/project/GetProjectBySlug.js';
import { ReorderProjects } from './application/use-cases/project/ReorderProjects.js';
import { UpsertSkills } from './application/use-cases/skill/UpsertSkills.js';
import { ListTags } from './application/use-cases/skill/ListTags.js';

import { ProfileController } from './presentation/controllers/ProfileController.js';
import { ProjectController } from './presentation/controllers/ProjectController.js';
import { SkillController } from './presentation/controllers/SkillController.js';
import { buildRouter } from './presentation/routes/index.js';
import { errorHandler } from './presentation/middlewares/errorHandler.js';

// ====================================================================
// COMPOSITION ROOT
// Aqui — e só aqui — as implementações concretas são escolhidas e
// injetadas. Trocar Supabase por outro banco é mudar esta seção.
// ====================================================================
export function createApp() {
  // -- Infraestrutura (implementações concretas dos contratos) --------
  const profileRepository = new SupabaseProfileRepository(supabase);
  const projectRepository = new SupabaseProjectRepository(supabase);
  const skillRepository = new SupabaseSkillRepository(supabase);
  const tagRepository = new SupabaseTagRepository(supabase);

  // -- Use cases (dependem apenas dos contratos) ----------------------
  const profileController = new ProfileController({
    getProfileByUsername: new GetProfileByUsername({
      profileRepository,
      skillRepository,
      projectRepository,
    }),
    getMyProfile: new GetMyProfile({ profileRepository }),
    updateProfile: new UpdateProfile({ profileRepository }),
  });

  const projectController = new ProjectController({
    createProject: new CreateProject({ projectRepository, profileRepository }),
    updateProject: new UpdateProject({ projectRepository }),
    deleteProject: new DeleteProject({ projectRepository }),
    listMyProjects: new ListMyProjects({ projectRepository }),
    getProjectBySlug: new GetProjectBySlug({ profileRepository, projectRepository }),
    reorderProjects: new ReorderProjects({ projectRepository }),
  });

  const skillController = new SkillController({
    upsertSkills: new UpsertSkills({ skillRepository }),
    listTags: new ListTags({ tagRepository }),
  });

  // -- Express --------------------------------------------------------
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', buildRouter({ profileController, projectController, skillController }));

  app.use(errorHandler);
  return app;
}
