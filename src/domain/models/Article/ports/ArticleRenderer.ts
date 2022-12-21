import type { Article } from '@/domain/models/Article';

interface ArticleRenderer {
  renderArticle(article: Article): Promise<string>;
  renderDisclaimer(article: Article): Promise<string>;
  renderStrokeFacts(article: Article): Promise<string>;
  renderStrokeSigns(article: Article): Promise<string>;
}

export type { ArticleRenderer };
