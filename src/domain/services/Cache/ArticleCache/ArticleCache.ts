import type {
  CachedArticleRepository,
  Article,
  ArticleId,
  BaseDesignation,
  ArticleRepository,
} from '@/domain/models/Article';
import type { ImageCache } from '@/domain/models/Image';
import {
  sourceAvailableGetMultiple,
  sourceAvailableGetSingle,
} from '@/domain/services/Cache/ArticleCache/sourceAvailableGet';
import {
  sourceUnavailableGetMultiple,
  sourceUnavailableGetSingle,
} from '@/domain/services/Cache/ArticleCache/sourceUnavailableGet';

type CacheInvalidatedCallback<T> = (newValue: T) => void;

class ArticleCache {
  constructor(
    private readonly imageCache: ImageCache,
    private readonly articleRepository: ArticleRepository,
    private readonly cachedArticleRepository: CachedArticleRepository
  ) {}

  async getByDesignation(
    d: BaseDesignation,
    cb: CacheInvalidatedCallback<Article[]>
  ): Promise<Article[]> {
    const getFromRepo = () => this.articleRepository.getByDesignation(d);
    const getFromCache = () => this.cachedArticleRepository.getByDesignation(d);
    if (!(await this.articleRepository.isAvailable())) {
      return sourceUnavailableGetMultiple(
        this.imageCache,
        this.cachedArticleRepository,
        getFromCache
      );
    }
    return sourceAvailableGetMultiple(
      this.imageCache,
      this.cachedArticleRepository,
      getFromRepo,
      getFromCache,
      cb
    );
  }

  async getById(
    id: ArticleId,
    cb: CacheInvalidatedCallback<Article>
  ): Promise<Article> {
    const getFromRepo = () => this.articleRepository.getById(id);
    const getFromCache = () => this.cachedArticleRepository.getById(id);
    if (!(await this.articleRepository.isAvailable())) {
      return sourceUnavailableGetSingle(
        this.imageCache,
        this.cachedArticleRepository,
        getFromCache
      );
    }
    return sourceAvailableGetSingle(
      this.imageCache,
      this.cachedArticleRepository,
      getFromRepo,
      getFromCache,
      cb
    );
  }

  async getAll(cb: CacheInvalidatedCallback<Article[]>): Promise<Article[]> {
    const getFromRepo = () => this.articleRepository.getAll();
    const getFromCache = () => this.cachedArticleRepository.getAll();
    if (!(await this.articleRepository.isAvailable())) {
      return sourceUnavailableGetMultiple(
        this.imageCache,
        this.cachedArticleRepository,
        getFromCache
      );
    }
    return sourceAvailableGetMultiple(
      this.imageCache,
      this.cachedArticleRepository,
      getFromRepo,
      getFromCache,
      cb
    );
  }

  async clearCache() {
    return this.cachedArticleRepository.clearCache();
  }
}

export { ArticleCache };
