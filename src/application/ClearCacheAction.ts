import type { ImageCache } from '@/domain/models/Image';
import type {
  AlgorithmCache,
  ArticleCache,
  TagCache,
} from '@/domain/services/Cache';

class ClearCacheAction {
  constructor(
    private readonly articleCache: ArticleCache,
    private readonly tagCache: TagCache,
    private readonly imageCache: ImageCache,
    private readonly algorithmCache: AlgorithmCache
  ) {}

  async execute() {
    return Promise.all([
      this.tagCache.clearCache(),
      this.articleCache.clearCache(),
      this.imageCache.clearCache(),
      this.algorithmCache.clearCache(),
    ]);
  }
}

export { ClearCacheAction };
