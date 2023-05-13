import {
  Article,
  ArticleCache,
  ArticleId,
  ArticleNotFoundError,
  Designation,
  NullArticle,
  SourceUnavailableCacheEmptyError,
} from '@/domain/models/Article';
import type { CachedArticleRepository } from '@/domain/models/Article';
import { Image } from '@/domain/models/Image';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

describe('ArticleCache', () => {
  const cacheRepo = {
    isEmpty: jest.fn(),
    saveAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByDesignation: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    clearCache: jest.fn(),
    isAvailable: jest.fn(),
  } satisfies CachedArticleRepository;

  const articleRepo = new FakeArticleRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Instantiation', () => {
    it('should be created with source and cache repos', () => {
      const create = () => new ArticleCache(articleRepo, cacheRepo);
      expect(create).not.toThrowError();
    });
  });

  describe('#getByDesignation', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use source result if cache errors', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getByDesignation.mockRejectedValue(new Error('Boom!'));
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const callback = jest.fn();

      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should store source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      expect(cacheRepo.update).not.toHaveBeenCalled();
      expect(cacheRepo.delete).not.toHaveBeenCalled();
      expect(cacheRepo.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Article)])
      );
    });

    it('should use cache result if source is unavailable', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache if source errors', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      spy.mockRejectedValue(new Error('boom'));
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should throw error if cache is empty and source is unavailable', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const boom = () => cache.getByDesignation(Designation.ARTICLE, callback);
      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableCacheEmptyError
      );
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(articles[0].getTitle()).toBe('Example Article From Cache');
      expect(callback).toHaveBeenCalledTimes(1);
      const newArticle = callback.mock.calls[0][0][0];
      expect(newArticle.getTitle()).toBe('Example Article From Source');
    });

    it('should use cache result and run callback with source result if cache missing new article', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const upToDateArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([upToDateArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle1 = new Article({
        id: new ArticleId('1'),
        title: 'Example Article From Source 1',
        html: '<h1>Hello World From Source 1</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([upToDateArticle, sourceArticle1]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(upToDateArticle)).toBe(true);
      expect(articles[0].getTitle()).toBe('Example Article');
      expect(callback).toHaveBeenCalledTimes(1);
      const unchangedArticle = callback.mock.calls[0][0][0];
      expect(unchangedArticle.getTitle()).toBe('Example Article');
      const newArticle = callback.mock.calls[0][0][1];
      expect(newArticle.is(sourceArticle1)).toBe(true);
    });

    it('should update cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.update).toBeCalledTimes(1);
      const calledWith = cacheRepo.update.mock.calls[0][0];
      expect(calledWith.getTitle()).toBe('Example Article From Source');
    });

    it('should remove deleted cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      spy.mockResolvedValue([]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.delete).toBeCalledTimes(1);
      const calledWith = cacheRepo.delete.mock.calls[0][0];
      expect(calledWith.is(new ArticleId('0'))).toBe(true);
    });

    it('should create new cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getByDesignation.mockResolvedValue([]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toBeCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith[0].getTitle()).toBe('Example Article From Source');
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockRejectedValueOnce(new Error('Boom 1'));
      spy.mockRejectedValueOnce(new Error('Boom 2'));
      spy.mockResolvedValueOnce([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toBeCalled();
      expect(spy).toBeCalledTimes(3);
    });
  });

  describe('#getById', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getById.mockResolvedValue(cachedArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const article = await cache.getById(new ArticleId('1'), callback);
      await new Promise(process.nextTick);
      expect(article.is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use source result if cache errors', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getById.mockRejectedValue(new Error('Boom!'));
      const spy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue(sourceArticle);
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const callback = jest.fn();

      const article = await cache.getById(new ArticleId('1'), callback);
      await new Promise(process.nextTick);
      expect(article.is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should store source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getById(new ArticleId('1'), callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      expect(cacheRepo.update).not.toHaveBeenCalled();
      expect(cacheRepo.delete).not.toHaveBeenCalled();
      expect(cacheRepo.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Article)])
      );
    });

    it('should use cache result if source is unavailable', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getById.mockResolvedValue(cachedArticle);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache if source errors', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getById.mockResolvedValue(cachedArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      spy.mockRejectedValue(new Error('boom'));
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should throw error if cache is empty and source is unavailable', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const boom = () => cache.getById(new ArticleId('0'), callback);
      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableCacheEmptyError
      );
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getById.mockResolvedValue(cachedArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(cachedArticle)).toBe(true);
      expect(article.getTitle()).toBe('Example Article From Cache');
      expect(callback).toHaveBeenCalledTimes(1);
      const newArticle = callback.mock.calls[0][0];
      expect(newArticle.getTitle()).toBe('Example Article From Source');
    });

    it('should update cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getById.mockResolvedValue(cachedArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.update).toBeCalledTimes(1);
      const calledWith = cacheRepo.update.mock.calls[0][0];
      expect(calledWith.getTitle()).toBe('Example Article From Source');
    });

    it('should remove deleted cached article and calls callback with null article', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getById.mockResolvedValue(cachedArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      spy.mockRejectedValue(new ArticleNotFoundError(new ArticleId('0')));
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(cachedArticle)).toBe(true);
      expect(cacheRepo.delete).toBeCalledTimes(1);
      const deleteCalledWith = cacheRepo.delete.mock.calls[0][0];
      expect(deleteCalledWith.is(new ArticleId('0'))).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
      const callbackCalledWith = callback.mock.calls[0][0];
      expect(callbackCalledWith).toBeInstanceOf(NullArticle);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockRejectedValueOnce(new Error('Boom 1'));
      spy.mockRejectedValueOnce(new Error('Boom 2'));
      spy.mockResolvedValueOnce(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const article = await cache.getById(new ArticleId('1'), callback);
      await new Promise(process.nextTick);
      expect(article.is(sourceArticle)).toBe(true);
      expect(callback).not.toBeCalled();
      expect(spy).toBeCalledTimes(3);
    });
  });

  describe('#getAll', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use source result if cache errors', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getAll.mockRejectedValue(new Error('Boom!'));
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const callback = jest.fn();

      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should store source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      expect(cacheRepo.update).not.toHaveBeenCalled();
      expect(cacheRepo.delete).not.toHaveBeenCalled();
      expect(cacheRepo.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Article)])
      );
    });

    it('should use cache result if source is unavailable', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache if source errors', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      spy.mockRejectedValue(new Error('boom'));
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should throw error if cache is empty and source is unavailable', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const boom = () => cache.getAll(callback);
      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableCacheEmptyError
      );
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(articles[0].getTitle()).toBe('Example Article From Cache');
      expect(callback).toHaveBeenCalledTimes(1);
      const newArticle = callback.mock.calls[0][0][0];
      expect(newArticle.getTitle()).toBe('Example Article From Source');
    });

    it('should use cache result and run callback with source result if cache missing new article', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const upToDateArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([upToDateArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle1 = new Article({
        id: new ArticleId('1'),
        title: 'Example Article From Source 1',
        html: '<h1>Hello World From Source 1</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockResolvedValue([upToDateArticle, sourceArticle1]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(upToDateArticle)).toBe(true);
      expect(articles[0].getTitle()).toBe('Example Article');
      await new Promise(process.nextTick);
      expect(callback).toHaveBeenCalledTimes(1);
      const unchangedArticle = callback.mock.calls[0][0][0];
      expect(unchangedArticle.getTitle()).toBe('Example Article');
      const newArticle = callback.mock.calls[0][0][1];
      expect(newArticle.is(sourceArticle1)).toBe(true);
    });

    it('should update cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.update).toBeCalledTimes(1);
      const calledWith = cacheRepo.update.mock.calls[0][0];
      expect(calledWith.getTitle()).toBe('Example Article From Source');
    });

    it('should remove deleted cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const cachedArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Cache',
        html: '<h1>Hello World From Cache</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([cachedArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      spy.mockResolvedValue([]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.delete).toBeCalledTimes(1);
      const calledWith = cacheRepo.delete.mock.calls[0][0];
      expect(calledWith.is(new ArticleId('0'))).toBe(true);
    });

    it('should create new cached articles if cache is stale', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getAll.mockResolvedValue([]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      spy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toBeCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith[0].getTitle()).toBe('Example Article From Source');
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      const spy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('1'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      spy.mockRejectedValueOnce(new Error('Boom 1'));
      spy.mockRejectedValueOnce(new Error('Boom 2'));
      spy.mockResolvedValueOnce([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(articleRepo, cacheRepo);
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toBeCalled();
      expect(spy).toBeCalledTimes(3);
    });
  });

  describe('#clearCache', () => {
    it('should clear the cache', async () => {
      const cache = new ArticleCache(articleRepo, cacheRepo);
      await cache.clearCache();
      expect(cacheRepo.clearCache).toBeCalledTimes(1);
    });
  });
});
