import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { Article, ArticleId } from '@/domain/models/Article';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

describe('GetAllArticlesAction', () => {
  describe('Instantiation', () => {
    it('should create a new action', () => {
      const repo = new FakeArticleRepository();
      const create = () => new GetAllArticlesAction(repo);

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: FakeArticleRepository;

    beforeEach(() => {
      repo = new FakeArticleRepository();
    });

    it('should get all articles', async () => {
      const action = new GetAllArticlesAction(repo);
      const articles = await action.execute();
      expect(articles.length).toBe(1000);
      articles.forEach((a) => {
        expect(a).toBeInstanceOf(Article);
        expect(a.getId()).toBeInstanceOf(ArticleId);
      });
    });
  });
});
