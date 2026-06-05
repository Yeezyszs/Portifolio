import { describe, it, expect, vi } from 'vitest';
import { CreateProject } from '../../../src/application/use-cases/project/CreateProject.js';
import { ConflictError, ValidationError, NotFoundError } from '../../../src/domain/errors/errors.js';

// Repositórios fake: provam que o use case roda sem Express e sem banco.
function makeDeps({ profile = { id: 'u1' }, existingSlug = null } = {}) {
  const profileRepository = {
    findById: vi.fn().mockResolvedValue(profile),
  };
  const projectRepository = {
    findBySlug: vi.fn().mockResolvedValue(existingSlug),
    create: vi.fn().mockImplementation((project) => Promise.resolve({ id: 'p1', ...project })),
  };
  return { profileRepository, projectRepository };
}

describe('CreateProject', () => {
  it('cria um projeto e gera o slug a partir do título', async () => {
    const deps = makeDeps();
    const useCase = new CreateProject(deps);

    await useCase.execute({ userId: 'u1', title: 'Meu App Legal', tagIds: ['t1'] });

    expect(deps.projectRepository.create).toHaveBeenCalledOnce();
    const [project, tagIds] = deps.projectRepository.create.mock.calls[0];
    expect(project.slug).toBe('meu-app-legal');
    expect(project.profileId).toBe('u1');
    expect(tagIds).toEqual(['t1']);
  });

  it('rejeita título muito curto via validação da entidade', async () => {
    const useCase = new CreateProject(makeDeps());
    await expect(useCase.execute({ userId: 'u1', title: 'x' })).rejects.toThrow(ValidationError);
  });

  it('rejeita quando o perfil não existe', async () => {
    const useCase = new CreateProject(makeDeps({ profile: null }));
    await expect(useCase.execute({ userId: 'u1', title: 'Projeto' })).rejects.toThrow(NotFoundError);
  });

  it('rejeita slug duplicado para o mesmo dono', async () => {
    const useCase = new CreateProject(makeDeps({ existingSlug: { id: 'old' } }));
    await expect(useCase.execute({ userId: 'u1', title: 'Projeto' })).rejects.toThrow(ConflictError);
  });
});
