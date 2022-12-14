import type { BaseDesignation } from '@/domain/models/Article';
import { Article, ArticleId, Designation } from '@/domain/models/Article';
import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';
import { fakeArticles } from '@/infrastructure/persistence/fake/FakeArticleRepository/fakeArticles';

class FakeArticleRepository implements ArticleRepository {
  fakeArticles = fakeArticles.slice();

  async getAllArticles(): Promise<Article[]> {
    return this.fakeArticles.map(
      (p) =>
        new Article({
          id: new ArticleId(p.id),
          title: p.title,
          html: p.html,
          designation: Designation[p.designation],
        })
    );
  }

  async getArticlesByDesignation(d: BaseDesignation): Promise<Article[]> {
    let articles = this.fakeArticles;
    if (d.type === 'StrokeFacts') {
      articles = fakeArticles.filter((a) => a.designation === 'STROKE_FACTS');
    } else if (d.type === 'StrokeSigns') {
      articles = fakeArticles.filter((a) => a.designation === 'STROKE_SIGNS');
    } else if (d.type === 'Disclaimer') {
      articles = fakeArticles.filter((a) => a.designation === 'DISCLAIMER');
    } else {
      articles = fakeArticles.filter((a) => a.designation === 'ARTICLE');
    }

    return articles.map(
      (p) =>
        new Article({
          id: new ArticleId(p.id),
          title: p.title,
          html: p.html,
          designation: Designation[p.designation],
        })
    );
  }

  async getArticleById(id: ArticleId): Promise<Article> {
    const articles = this.fakeArticles.find((a) => a.id === id.getId());
    if (!articles) throw Error('Article not found');

    return new Article({
      id: new ArticleId(articles.id),
      title: articles.title,
      html: articles.html,
      designation: Designation[articles.designation],
    });
  }
}

export { FakeArticleRepository };
