import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// Monta todas as rotas a partir dos controllers já instanciados no app.js.
export function buildRouter({ profileController, projectController, skillController }) {
  const router = Router();

  // ---- Públicas ----------------------------------------------------
  router.get('/tags', skillController.tags);
  router.get('/users/:username', profileController.publicByUsername);
  router.get('/users/:username/projects/:slug', projectController.publicBySlug);

  // ---- Privadas (exigem Bearer token) ------------------------------
  router.use('/me', authMiddleware);

  router.get('/me', profileController.me);
  router.put('/me', profileController.update);

  router.get('/me/projects', projectController.listMine);
  router.post('/me/projects', projectController.create);
  router.put('/me/projects/reorder', projectController.reorder);
  router.put('/me/projects/:id', projectController.update);
  router.delete('/me/projects/:id', projectController.remove);

  router.put('/me/skills', skillController.upsert);

  return router;
}
