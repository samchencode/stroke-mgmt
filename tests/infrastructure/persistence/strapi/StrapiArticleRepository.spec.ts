/* eslint-disable @typescript-eslint/no-explicit-any */

import { Article, ArticleId } from '@/domain/models/Article';
import { StrapiArticleRepository } from '@/infrastructure/persistence/strapi/StrapiArtcleRepository';
import { FakeImageRepository } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository/FakeImageRepository';
import { Tag } from '@/domain/models/Tag';
import { allArticles, articleOne, articleWithTag } from './fakeResponses';

const makeFetch = (parsedResponse?: any) =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(parsedResponse),
  });

const mockNetworkInfo = {
  isInternetReachable: jest.fn().mockResolvedValue(true),
};

describe('StrapiArticleRepository', () => {
  describe('Instantiation', () => {
    it('should create a repo', () => {
      const imageRepo = new FakeImageRepository();

      const create = () =>
        new StrapiArticleRepository(
          'myhost.com',
          makeFetch(),
          imageRepo,
          mockNetworkInfo
        );

      expect(create).not.toThrow();
    });
  });

  describe('Behavior', () => {
    it('should get all articles', async () => {
      const imageRepo = new FakeImageRepository();

      const repo = new StrapiArticleRepository(
        'myhost.com',
        makeFetch(allArticles),
        imageRepo,
        mockNetworkInfo
      );
      const articles = await repo.getAll();
      expect(articles).toHaveLength(5);
      expect(articles).toEqual(expect.arrayContaining([expect.any(Article)]));
    });

    it('should get article by id', async () => {
      const imageRepo = new FakeImageRepository();
      const repo = new StrapiArticleRepository(
        'myhost.com',
        makeFetch(articleOne),
        imageRepo,
        mockNetworkInfo
      );
      const article = await repo.getById(new ArticleId('1'));
      expect(article.getTitle()).toBe(
        'Stroke Prevention: Easy Steps You Can Take Every Day'
      );
    });

    it('should get articles with tags', async () => {
      const imageRepo = new FakeImageRepository();
      const repo = new StrapiArticleRepository(
        'myhost.com',
        makeFetch(articleWithTag),
        imageRepo,
        mockNetworkInfo
      );

      const article = await repo.getById(new ArticleId('6'));
      const tags = article.getTags();

      expect(tags[0].is(new Tag('General', new Date(0)))).toBe(true);
    });
  });
});
