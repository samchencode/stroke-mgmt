import type { ImageCache } from '@/domain/models/Image';
import type {
  AlgorithmCache,
  ArticleCache,
  IntroSequenceCache,
  TagCache,
} from '@/domain/services/Cache';

class ClearCacheAction {
  constructor(
    private readonly articleCache: ArticleCache,
    private readonly tagCache: TagCache,
    private readonly imageCache: ImageCache,
    private readonly algorithmCache: AlgorithmCache,
    private readonly introSequenceCache: IntroSequenceCache
  ) {}

  static $inject = [
    'articleCache',
    'tagCache',
    'imageCache',
    'algorithmCache',
    'introSequenceCache',
  ];

  async execute() {
    return Promise.all([
      this.tagCache.clearCache(),
      this.articleCache.clearCache(),
      this.imageCache.clearCache(),
      this.algorithmCache.clearCache(),
      this.introSequenceCache.clearCache(),
    ]);
  }
}

export { ClearCacheAction };
