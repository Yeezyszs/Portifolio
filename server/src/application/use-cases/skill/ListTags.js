// Retorna o catálogo global de tags para os selects do frontend.
export class ListTags {
  constructor({ tagRepository }) {
    this.tagRepo = tagRepository;
  }

  async execute() {
    return this.tagRepo.findAll();
  }
}
