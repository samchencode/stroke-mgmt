import { AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleId } from '@/domain/models/Article';
import type {
  CachedIntroSequenceRepository,
  IntroSequenceRepository,
} from '@/domain/models/IntroSequence';
import { IntroSequence } from '@/domain/models/IntroSequence';
import {
  IntroSequenceCache,
  SourceUnavailableEmptyCacheResultError,
} from '@/domain/services/Cache';

describe('IntroSequenceCache', () => {
  const sourceRepo = {
    get: jest.fn(),
    isAvailable: jest.fn(),
  } satisfies IntroSequenceRepository;

  const cacheRepo = {
    get: jest.fn(),
    isAvailable: jest.fn(),
    save: jest.fn(),
    clearCache: jest.fn(),
    isEmpty: jest.fn(),
  } satisfies CachedIntroSequenceRepository;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Instantiation', () => {
    it('should be created with source and cache repo', () => {
      const create = () => new IntroSequenceCache(sourceRepo, cacheRepo);
      expect(create).not.toThrow();
    });
  });

  describe('#get', () => {
    it('should use source result if cache is empty', async () => {
      const sourceSeq = new IntroSequence(
        [new ArticleId('SourceArticle')],
        new AlgorithmId('1'),
        new ArticleId('SourceArticle'),
        new Date(0)
      );
      sourceRepo.isAvailable.mockResolvedValue(true);
      sourceRepo.get.mockResolvedValue(sourceSeq);
      cacheRepo.isEmpty.mockResolvedValue(true);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      const result = await cache.get(callback);

      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(IntroSequence);
      expect(result.getArticleIds()).toHaveLength(1);
      const [id1] = result.getArticleIds();
      expect(id1.is(new ArticleId('SourceArticle'))).toBe(true);
    });

    it('should store source result if cache is empty', async () => {
      const sourceSeq = new IntroSequence(
        [new ArticleId('SourceArticle')],
        new AlgorithmId('1'),
        new ArticleId('SourceArticle'),
        new Date(0)
      );
      sourceRepo.isAvailable.mockResolvedValue(true);
      sourceRepo.get.mockResolvedValue(sourceSeq);
      cacheRepo.isEmpty.mockResolvedValue(true);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      await cache.get(callback);

      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(cacheRepo.save).toHaveBeenCalledTimes(1);
      expect(cacheRepo.save).toHaveBeenCalledWith(sourceSeq);
    });

    it('should use cache result if source is unavailable', async () => {
      const cachedSeq = new IntroSequence(
        [new ArticleId('CachedArticle')],
        new AlgorithmId('1'),
        new ArticleId('CachedArticle'),
        new Date(0)
      );
      sourceRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.get.mockResolvedValue(cachedSeq);
      cacheRepo.isEmpty.mockResolvedValue(false);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      const result = await cache.get(callback);

      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(IntroSequence);
      expect(result.getArticleIds()).toHaveLength(1);
      const [id1] = result.getArticleIds();
      expect(id1.is(new ArticleId('CachedArticle'))).toBe(true);
    });

    it('should use cache if source errors', async () => {
      const cachedSeq = new IntroSequence(
        [new ArticleId('CachedArticle')],
        new AlgorithmId('1'),
        new ArticleId('CachedArticle'),
        new Date(0)
      );
      sourceRepo.isAvailable.mockResolvedValue(true);
      sourceRepo.get.mockRejectedValue(new Error('Boom!'));
      cacheRepo.get.mockResolvedValue(cachedSeq);
      cacheRepo.isEmpty.mockResolvedValue(false);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      const result = await cache.get(callback);

      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(IntroSequence);
      expect(result.getArticleIds()).toHaveLength(1);
      const [id1] = result.getArticleIds();
      expect(id1.is(new ArticleId('CachedArticle'))).toBe(true);
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      sourceRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.isEmpty.mockResolvedValue(true);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      const boom = cache.get(callback);

      await expect(boom).rejects.toThrow(
        SourceUnavailableEmptyCacheResultError
      );
      expect(callback).not.toHaveBeenCalled();
    });

    it('should use cache result and run callback with source result if cache stale', async () => {
      const cachedSeq = new IntroSequence(
        [new ArticleId('StaleCachedArticle')],
        new AlgorithmId('1'),
        new ArticleId('StaleCachedArticle'),
        new Date(0)
      );
      const sourceSeq = new IntroSequence(
        [new ArticleId('SourceArticle')],
        new AlgorithmId('1'),
        new ArticleId('SourceArticle'),
        new Date(10)
      );
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.get.mockResolvedValue(cachedSeq);
      sourceRepo.isAvailable.mockResolvedValue(true);
      sourceRepo.get.mockResolvedValue(sourceSeq);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      const result = await cache.get(callback);

      await new Promise(process.nextTick);

      expect(result).toBeInstanceOf(IntroSequence);
      expect(result.getArticleIds()).toHaveLength(1);
      const [id1] = result.getArticleIds();
      expect(id1.is(new ArticleId('StaleCachedArticle'))).toBe(true);

      expect(callback).toHaveBeenCalledTimes(1);
      const newResult = callback.mock.calls[0][0];

      expect(newResult).toBeInstanceOf(IntroSequence);
      expect(newResult.getArticleIds()).toHaveLength(1);
      const [newId1] = newResult.getArticleIds();
      expect(newId1.is(new ArticleId('SourceArticle'))).toBe(true);
    });

    it('should use cache result and store source result if cache stale', async () => {
      const cachedSeq = new IntroSequence(
        [new ArticleId('StaleCachedArticle')],
        new AlgorithmId('1'),
        new ArticleId('StaleCachedArticle'),
        new Date(0)
      );
      const sourceSeq = new IntroSequence(
        [new ArticleId('SourceArticle')],
        new AlgorithmId('1'),
        new ArticleId('SourceArticle'),
        new Date(10)
      );
      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.get.mockResolvedValue(cachedSeq);
      sourceRepo.isAvailable.mockResolvedValue(true);
      sourceRepo.get.mockResolvedValue(sourceSeq);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      await cache.get(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.save).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.save.mock.calls[0][0];

      expect(calledWith).toBeInstanceOf(IntroSequence);
      expect(calledWith.getArticleIds()).toHaveLength(1);
      const [newId1] = calledWith.getArticleIds();
      expect(newId1.is(new ArticleId('SourceArticle'))).toBe(true);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      const sourceSeq = new IntroSequence(
        [new ArticleId('SourceArticle')],
        new AlgorithmId('1'),
        new ArticleId('SourceArticle'),
        new Date(0)
      );
      sourceRepo.isAvailable.mockResolvedValue(true);
      sourceRepo.get.mockRejectedValueOnce(new Error('Boom!'));
      sourceRepo.get.mockRejectedValueOnce(new Error('Boom!'));
      sourceRepo.get.mockResolvedValueOnce(sourceSeq);
      cacheRepo.isEmpty.mockResolvedValue(true);

      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      const callback = jest.fn();
      const result = await cache.get(callback);

      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(IntroSequence);
      expect(result.getArticleIds()).toHaveLength(1);
      const [id1] = result.getArticleIds();
      expect(id1.is(new ArticleId('SourceArticle'))).toBe(true);
    });
  });

  describe('#clearCache', () => {
    it('should call clear cache on cached intro sequence repository', async () => {
      const cache = new IntroSequenceCache(sourceRepo, cacheRepo);
      await cache.clearCache();
      expect(cacheRepo.clearCache).toHaveBeenCalledTimes(1);
    });
  });
});
