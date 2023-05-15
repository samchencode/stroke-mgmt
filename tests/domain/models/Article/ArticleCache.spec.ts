import {
  Article,
  ArticleId,
  ArticleNotFoundError,
  CachedArticleNotFoundError,
  Designation,
  NullArticle,
} from '@/domain/models/Article';
import type { CachedArticleRepository } from '@/domain/models/Article';
import type {
  CachedImageMetadataRepository,
  ImageStore,
} from '@/domain/models/Image';
import { Image, ImageCache } from '@/domain/models/Image';
import { NullImage } from '@/domain/models/Image/NullImage';
import {
  SourceUnavailableEmptyCacheResultError,
  ArticleCache,
} from '@/domain/services/Cache';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

describe('ArticleCache', () => {
  const getImageSrcsInHtml = jest.fn();
  const replaceImageSrcsInHtml = jest.fn();

  const imageStore = {
    getFileAsBase64Url: jest.fn(),
    saveFileFromUrl: jest.fn(),
    fileExists: jest.fn(),
    deleteAll: jest.fn(),
  } satisfies ImageStore;

  const cachedImageMetadataRepository = {
    get: jest.fn(),
    save: jest.fn(),
    clearCache: jest.fn(),
  } satisfies CachedImageMetadataRepository;

  const imageCache = new ImageCache(imageStore, cachedImageMetadataRepository);

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
    getImageSrcsInHtml.mockReturnValue([]);
    replaceImageSrcsInHtml.mockImplementation((map, html) => html);
  });

  describe('Instantiation', () => {
    it('should be created with imageCache and source and cache repos', () => {
      const create = () =>
        new ArticleCache(
          imageCache,
          articleRepo,
          cacheRepo,
          getImageSrcsInHtml,
          replaceImageSrcsInHtml
        );
      expect(create).not.toThrow();
    });
  });

  describe('#getByDesignation', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      cacheRepo.getByDesignation.mockResolvedValue([]);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      cacheRepo.getByDesignation.mockResolvedValue([]);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      cacheRepo.getByDesignation.mockResolvedValue([]);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const boom = () => cache.getByDesignation(Designation.ARTICLE, callback);
      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.update).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.delete).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should add image to cached article thumbnail', async () => {
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
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      spy.mockResolvedValue([sourceArticle]);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should add image to cached article thumbnail despite source unavailability', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
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
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
    });

    it('should add default image to article thumbnail if source unavailable and file not found', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
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
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail()).toBeInstanceOf(NullImage);
    });

    it('should save article thumbnail if cache stale', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getByDesignation.mockResolvedValue([]);
      const getByDesignationSpy = jest.spyOn(articleRepo, 'getByDesignation');
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
      getByDesignationSpy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img.png'
      );
    });

    it('should download article thumbnail if cached version not found', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

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
      const getByDesignationSpy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img-new.png'),
        shouldShowOnHomeScreen: true,
        // notice no new update from source
        lastUpdated: new Date(0),
        tags: [],
      });
      getByDesignationSpy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img.png'
      );
    });

    it('should update article thumbnail if cache stale', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);

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
      const getByDesignationSpy = jest.spyOn(articleRepo, 'getByDesignation');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img-new.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      getByDesignationSpy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getByDesignation(Designation.ARTICLE, callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img-new.png'
      );
    });

    it('should replace image src with local image in cached article', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([originalArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      spy.mockResolvedValue([originalArticle]);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64Url'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(new Image('bar.png'));
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(originalArticle)).toBe(true);
      expect(articles[0].getHtml()).toBe('<img src="bar.png">');
    });

    it('should replace image src with default (aka null) image if image not found and source unavailble', async () => {
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([originalArticle]);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(originalArticle)).toBe(true);
      expect(articles[0].getHtml()).toBe(
        `<img src="${new NullImage().getUri()}">`
      );
    });

    it('should not replace image src in cached article if image not found and source available', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue([originalArticle]);
      const spy = jest.spyOn(articleRepo, 'getByDesignation');
      spy.mockResolvedValue([originalArticle]);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getByDesignation(
        Designation.ARTICLE,
        callback
      );
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(originalArticle)).toBe(true);
      expect(articles[0].getHtml()).toBe(`<img src="${imageUrl}">`);
    });
  });

  describe('#getById', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      cacheRepo.getById.mockRejectedValue(
        new CachedArticleNotFoundError(new ArticleId('1'))
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();

      const article = await cache.getById(new ArticleId('1'), callback);
      await new Promise(process.nextTick);
      expect(article.is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should store source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      cacheRepo.getById.mockRejectedValue(
        new CachedArticleNotFoundError(new ArticleId('1'))
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      cacheRepo.getById.mockRejectedValue(
        new CachedArticleNotFoundError(new ArticleId('0'))
      );
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const boom = () => cache.getById(new ArticleId('0'), callback);
      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.update).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(cachedArticle)).toBe(true);
      expect(cacheRepo.delete).toHaveBeenCalledTimes(1);
      const deleteCalledWith = cacheRepo.delete.mock.calls[0][0];
      expect(deleteCalledWith.is(new ArticleId('0'))).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
      const callbackCalledWith = callback.mock.calls[0][0];
      expect(callbackCalledWith).toBeInstanceOf(NullArticle);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      cacheRepo.getById.mockRejectedValue(
        new CachedArticleNotFoundError(new ArticleId('1'))
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const article = await cache.getById(new ArticleId('1'), callback);
      await new Promise(process.nextTick);
      expect(article.is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should add image to cached article thumbnail', async () => {
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
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      const spy = jest.spyOn(articleRepo, 'getById');
      spy.mockResolvedValue(sourceArticle);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getById(new ArticleId('0'), callback);
      expect(result.getThumbnail().getUri()).toBe('file://my-img.png');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should add image to cached article thumbnail despite source unavailability', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
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
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getById(new ArticleId('0'), callback);
      expect(result.getThumbnail().getUri()).toBe('file://my-img.png');
    });

    it('should add default image to article thumbnail if source unavailable and file not found', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
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
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(result.getThumbnail()).toBeInstanceOf(NullImage);
    });

    it('should save article thumbnail if cache stale', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getById.mockResolvedValue(new NullArticle());
      const getByIdSpy = jest.spyOn(articleRepo, 'getById');
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
      getByIdSpy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img.png'
      );
    });

    it('should download article thumbnail if cached version not found', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

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
      const getByIdSpy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img-new.png'),
        shouldShowOnHomeScreen: true,
        // notice no new update from source
        lastUpdated: new Date(0),
        tags: [],
      });
      getByIdSpy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img.png'
      );
    });

    it('should update article thumbnail if cache stale', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);

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
      const getByIdSpy = jest.spyOn(articleRepo, 'getById');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img-new.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      getByIdSpy.mockResolvedValue(sourceArticle);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img-new.png'
      );
    });

    it('should replace image src with local image in cached article', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue(originalArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      spy.mockResolvedValue(originalArticle);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64Url'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(new Image('bar.png'));
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(originalArticle)).toBe(true);
      expect(article.getHtml()).toBe('<img src="bar.png">');
    });

    it('should replace image src with default (aka null) image if image not found and source unavailble', async () => {
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue(originalArticle);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(originalArticle)).toBe(true);
      expect(article.getHtml()).toBe(`<img src="${new NullImage().getUri()}">`);
    });

    it('should not replace image src in cached article if image not found and source available', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getByDesignation.mockResolvedValue(originalArticle);
      const spy = jest.spyOn(articleRepo, 'getById');
      spy.mockResolvedValue(originalArticle);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const article = await cache.getById(new ArticleId('0'), callback);
      await new Promise(process.nextTick);
      expect(article.is(originalArticle)).toBe(true);
      expect(article.getHtml()).toBe(`<img src="${imageUrl}">`);
    });
  });

  describe('#getAll', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      cacheRepo.getAll.mockResolvedValue([]);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();

      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should store source result if cache is empty', async () => {
      cacheRepo.isEmpty.mockResolvedValue(true);
      cacheRepo.getAll.mockResolvedValue([]);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(cachedArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      cacheRepo.getAll.mockResolvedValue([]);
      const spy = jest.spyOn(articleRepo, 'isAvailable');
      spy.mockResolvedValue(false);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const boom = () => cache.getAll(callback);
      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.update).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.delete).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
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
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(sourceArticle)).toBe(true);
      expect(callback).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should add image to cached article thumbnail', async () => {
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
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: '<h1>Hello World From Repo</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      const spy = jest.spyOn(articleRepo, 'getAll');
      spy.mockResolvedValue([sourceArticle]);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getAll(callback);
      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should add image to cached article thumbnail despite source unavailability', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
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
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getAll(callback);
      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
    });

    it('should add default image to article thumbnail if source unavailable and file not found', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
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
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail()).toBeInstanceOf(NullImage);
    });

    it('should save article thumbnail if cache stale', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getAll.mockResolvedValue([]);
      const getAllSpy = jest.spyOn(articleRepo, 'getAll');
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
      getAllSpy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img.png'
      );
    });

    it('should download article thumbnail if cached version not found', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

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
      const getAllSpy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img-new.png'),
        shouldShowOnHomeScreen: true,
        // notice no new update from source
        lastUpdated: new Date(0),
        tags: [],
      });
      getAllSpy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img.png'
      );
    });

    it('should update article thumbnail if cache stale', async () => {
      const saveImageSpy = jest.spyOn(imageStore, 'saveFileFromUrl');
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      imageStore.fileExists.mockResolvedValue(false);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);

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
      const getAllSpy = jest.spyOn(articleRepo, 'getAll');
      const sourceArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article From Source',
        html: '<h1>Hello World From Source</h1>',
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img-new.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(1),
        tags: [],
      });
      getAllSpy.mockResolvedValue([sourceArticle]);
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(saveImageSpy).toHaveBeenCalledTimes(1);
      expect(saveImageSpy).toHaveBeenCalledWith(
        'https://my-website.com/img-new.png'
      );
    });

    it('should replace image src with local image in cached article', async () => {
      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([originalArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      spy.mockResolvedValue([originalArticle]);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64Url'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(new Image('bar.png'));
      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(originalArticle)).toBe(true);
      expect(articles[0].getHtml()).toBe('<img src="bar.png">');
    });

    it('should replace image src with default (aka null) image if image not found and source unavailble', async () => {
      const isAvailableSpy = jest.spyOn(articleRepo, 'isAvailable');
      isAvailableSpy.mockResolvedValue(false);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([originalArticle]);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(originalArticle)).toBe(true);
      expect(articles[0].getHtml()).toBe(
        `<img src="${new NullImage().getUri()}">`
      );
    });

    it('should not replace image src in cached article if image not found and source available', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const imageUrl = 'https://example.com/foo.png';
      const originalArticle = new Article({
        id: new ArticleId('0'),
        title: 'Example Article',
        html: `<img src="${imageUrl}">`,
        designation: Designation.ARTICLE,
        thumbnail: new Image('https://my-website.com/img.png'),
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
        tags: [],
      });
      cacheRepo.getAll.mockResolvedValue([originalArticle]);
      const spy = jest.spyOn(articleRepo, 'getAll');
      spy.mockResolvedValue([originalArticle]);
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const callback = jest.fn();
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const articles = await cache.getAll(callback);
      await new Promise(process.nextTick);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(originalArticle)).toBe(true);
      expect(articles[0].getHtml()).toBe(`<img src="${imageUrl}">`);
    });
  });

  describe('#clearCache', () => {
    it('should clear the cache', async () => {
      const cache = new ArticleCache(
        imageCache,
        articleRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.clearCache();
      expect(cacheRepo.clearCache).toHaveBeenCalledTimes(1);
    });
  });
});
