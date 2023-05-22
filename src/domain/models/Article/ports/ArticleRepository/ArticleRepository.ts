import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { BaseDesignation } from '@/domain/models/Article/Designation';

interface ArticleRepository {
  getByDesignation(d: BaseDesignation): Promise<Article[]>;
  getById(id: ArticleId): Promise<Article>;
  getAll(): Promise<Article[]>;
  isAvailable(): Promise<boolean>;
}

export type { ArticleRepository };
