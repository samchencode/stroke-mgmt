import type {
  Article,
  ArticleId,
  BaseDesignation,
} from '@/domain/models/Article';

interface ArticleRepository {
  getByDesignation(d: BaseDesignation): Promise<Article[]>;
  getById(id: ArticleId): Promise<Article>;
  getAll(): Promise<Article[]>;
}

export type { ArticleRepository };
