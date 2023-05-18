import type { ArticleCache, TagCache } from '@/domain/services/Cache';

class ClearCacheAction {
  constructor(
    private readonly articleCache: ArticleCache,
    private readonly tagCache: TagCache
  ) {}

  async execute() {
    return Promise.all([
      this.tagCache.clearCache(),
      this.articleCache.clearCache(),
    ]);
  }
}

export { ClearCacheAction };
