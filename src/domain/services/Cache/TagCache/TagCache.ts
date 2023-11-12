import type { Tag } from '@/domain/models/Tag/Tag';
import type { TagRepository } from '@/domain/models/Tag/ports/TagRepository';
import type { CachedTagRepository } from '@/domain/models/Tag/ports/CachedTagRepository';
import { sourceUnavailableGet } from '@/domain/services/Cache/TagCache/sourceUnavailableGet';
import { sourceAvailableGet } from '@/domain/services/Cache/TagCache/sourceAvailableGet';

class TagCache {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly cachedTagRepository: CachedTagRepository
  ) {}

  static $inject = ['tagRepository', 'cachedTagRepository'];

  async getAll(onStale: (v: Tag[]) => void): Promise<Tag[]> {
    const sourceAvailable = await this.tagRepository.isAvailable();

    const sourceGetter = () => this.tagRepository.getAll();
    const cacheGetter = () => this.cachedTagRepository.getAll();

    if (!sourceAvailable) return sourceUnavailableGet(cacheGetter);
    return sourceAvailableGet(
      this.cachedTagRepository,
      sourceGetter,
      cacheGetter,
      onStale
    );
  }

  async clearCache() {
    return this.cachedTagRepository.clearCache();
  }
}

export { TagCache };
