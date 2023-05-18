import type { Tag } from '@/domain/models/Tag';
import type { TagCache } from '@/domain/services/Cache';

class GetAllTagsAction {
  constructor(private readonly tagCache: TagCache) {}

  async execute(onStale: (t: Tag[]) => void) {
    return this.tagCache.getAll(onStale);
  }
}

export { GetAllTagsAction };
