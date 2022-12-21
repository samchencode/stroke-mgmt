import type {
  Article,
  ArticleId,
  BaseDesignation,
} from '@/domain/models/Article';

interface ArticleRepository {
  getArticlesByDesignation(d: BaseDesignation): Promise<Article[]>;
  getArticleById(id: ArticleId): Promise<Article>;
  getAllArticles(): Promise<Article[]>;
}

export type { ArticleRepository };
