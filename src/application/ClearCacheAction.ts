import type { ImageCache } from '@/domain/models/Image';
import type { ArticleCache, TagCache } from '@/domain/services/Cache';

class ClearCacheAction {
  constructor(
    private readonly articleCache: ArticleCache,
    private readonly tagCache: TagCache,
    private readonly imageCache: ImageCache
  ) {}

  async execute() {
    return Promise.all([
      this.tagCache.clearCache(),
      this.articleCache.clearCache(),
      this.imageCache.clearCache(),
    ]);
  }
}

export { ClearCacheAction };
