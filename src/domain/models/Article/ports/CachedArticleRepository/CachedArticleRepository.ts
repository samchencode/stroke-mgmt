import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';

interface CachedArticleRepository extends ArticleRepository {
  isEmpty(): Promise<boolean>;
  saveAll(a: Article[]): Promise<void>;
  update(a: Article): Promise<void>;
  delete(a: ArticleId): Promise<void>;
  clearCache(): Promise<void>;
}

export type { CachedArticleRepository };
