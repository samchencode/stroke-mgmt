import type { CachedArticleRepository } from '@/domain/models/Article/ports/CachedArticleRepository';
import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { BaseDesignation } from '@/domain/models/Article/Designation';
import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';
import {
  sourceAvailableGetMultiple,
  sourceAvailableGetSingle,
} from '@/domain/models/Article/ArticleCache/sourceAvailableGet';
import { sourceUnavailableGet } from '@/domain/models/Article/ArticleCache/sourceUnavailableGet';

type CacheInvalidatedCallback<T> = (newValue: T) => void;

class ArticleCache {
  constructor(
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
      return sourceUnavailableGet(this.cachedArticleRepository, getFromCache);
    }
    return sourceAvailableGetMultiple(
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
      return sourceUnavailableGet(this.cachedArticleRepository, getFromCache);
    }
    return sourceAvailableGetSingle(
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
      return sourceUnavailableGet(this.cachedArticleRepository, getFromCache);
    }
    return sourceAvailableGetMultiple(
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
