import type { TagRepository } from '@/domain/models/Tag';

class GetAllTagsAction {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute() {
    return this.tagRepository.getAll();
  }
}

export { GetAllTagsAction };
