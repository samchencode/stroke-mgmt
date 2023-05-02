import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { ArticleMetadata } from '@/domain/models/Article/ArticleMetadata';
import type { BaseDesignation } from '@/domain/models/Article/Designation';

interface ArticleRepository {
  getByDesignation(d: BaseDesignation): Promise<Article[]>;
  getById(id: ArticleId): Promise<Article>;
  getAll(): Promise<Article[]>;
  getMetadataByDesignation(d: BaseDesignation): Promise<ArticleMetadata[]>;
  getMetadataById(id: ArticleId): Promise<ArticleMetadata>;
  getAllMetadata(): Promise<ArticleMetadata[]>;
  isAvailable(): Promise<boolean>;
}

export type { ArticleRepository };
