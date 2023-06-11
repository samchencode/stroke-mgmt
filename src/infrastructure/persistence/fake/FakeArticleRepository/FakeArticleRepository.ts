import type { BaseDesignation } from '@/domain/models/Article';
import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { ArticleMetadata } from '@/domain/models/Article/ArticleMetadata';
import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';
import { Image } from '@/domain/models/Image';
import { fakeArticles } from '@/infrastructure/persistence/fake/FakeArticleRepository/fakeArticles';

class FakeArticleRepository implements ArticleRepository {
  fakeArticles = fakeArticles.slice();

  async getAll(): Promise<Article[]> {
    return this.fakeArticles.map(
      (p) =>
        new Article({
          id: new ArticleId(p.id),
          title: p.title,
          html: p.html,
          designation: Designation[p.designation],
          summary: p.summary,
          thumbnail: new Image(p.thumbnail),
          shouldShowOnHomeScreen: true,
          lastUpdated: new Date(0),
        })
    );
  }

  async getByDesignation(d: BaseDesignation): Promise<Article[]> {
    let articles = this.fakeArticles;
    if (d.type === 'Disclaimer') {
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
          summary: p.summary,
          thumbnail: new Image(p.thumbnail),
          shouldShowOnHomeScreen: true,
          lastUpdated: new Date(0),
        })
    );
  }

  async getById(id: ArticleId): Promise<Article> {
    const articles = this.fakeArticles.find((a) => a.id === id.getId());
    if (!articles) throw Error('Article not found');

    return new Article({
      id: new ArticleId(articles.id),
      title: articles.title,
      html: articles.html,
      designation: Designation[articles.designation],
      summary: articles.summary,
      thumbnail: new Image(articles.thumbnail),
      shouldShowOnHomeScreen: true,
      lastUpdated: new Date(0),
    });
  }

  async getMetadataByDesignation(
    d: BaseDesignation
  ): Promise<ArticleMetadata[]> {
    let articles = this.fakeArticles;
    if (d.type === 'Disclaimer') {
      articles = fakeArticles.filter((a) => a.designation === 'DISCLAIMER');
    } else {
      articles = fakeArticles.filter((a) => a.designation === 'ARTICLE');
    }

    return articles.map(
      (a) => new ArticleMetadata(new ArticleId(a.id), new Date(0))
    );
  }

  async getMetadataById(id: ArticleId): Promise<ArticleMetadata> {
    const article = this.fakeArticles.find((a) => a.id === id.getId());
    if (!article) throw Error('Article not found');

    return new ArticleMetadata(new ArticleId(article.id), new Date(0));
  }

  async getAllMetadata(): Promise<ArticleMetadata[]> {
    return this.fakeArticles.map(
      (a) => new ArticleMetadata(new ArticleId(a.id), new Date(0))
    );
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

export { FakeArticleRepository };
