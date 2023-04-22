/* eslint-disable @typescript-eslint/no-explicit-any */

import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { StrapiArticleRepository } from '@/infrastructure/persistence/strapi/StrapiArtcleRepository';
import { FakeImageRepository } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository/FakeImageRepository';
import {
  allArticles,
  articleOne,
  designationStrokeFacts,
} from './fakeResponses';

const makeFetch = (parsedResponse?: any) =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(parsedResponse),
  });

describe('StrapiArticleRepository', () => {
  describe('Instantiation', () => {
    it('should create a repo', () => {
      const imageRepo = new FakeImageRepository();

      const create = () =>
        new StrapiArticleRepository('myhost.com', makeFetch(), imageRepo);

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get all articles', async () => {
      const imageRepo = new FakeImageRepository();

      const repo = new StrapiArticleRepository(
        'myhost.com',
        makeFetch(allArticles),
        imageRepo
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
        imageRepo
      );
      const article = await repo.getById(new ArticleId('1'));
      expect(article.getTitle()).toBe(
        'Stroke Prevention: Easy Steps You Can Take Every Day'
      );
    });

    it('should get article by designation', async () => {
      const imageRepo = new FakeImageRepository();
      const repo = new StrapiArticleRepository(
        'myhost.com',
        makeFetch(designationStrokeFacts),
        imageRepo
      );
      const [strokeFacts] = await repo.getByDesignation(
        Designation.STROKE_FACTS
      );
      expect(strokeFacts.getTitle()).toBe('Stroke Facts');
    });
  });
});
