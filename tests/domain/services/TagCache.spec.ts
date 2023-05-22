import type { CachedTagRepository, TagRepository } from '@/domain/models/Tag';
import { Tag } from '@/domain/models/Tag';
import {
  SourceUnavailableEmptyCacheResultError,
  TagCache,
} from '@/domain/services/Cache';

describe('TagCache', () => {
  const sourceRepository = {
    getAll: jest.fn(),
    isAvailable: jest.fn(),
  } satisfies TagRepository;

  const cacheRepository = {
    getAll: jest.fn(),
    saveAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    clearCache: jest.fn(),
    isAvailable: jest.fn(),
  } satisfies CachedTagRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Instantiation', () => {
    it('should be created with a cache and source repo', () => {
      const create = () => new TagCache(sourceRepository, cacheRepository);
      expect(create).not.toThrow();
    });
  });

  describe('#getAll', () => {
    it('should use source result if cache is empty', async () => {
      cacheRepository.getAll.mockResolvedValue([]);
      const tag = new Tag('MyTag', new Date(0), 'My Description');
      sourceRepository.getAll.mockResolvedValue([tag]);
      sourceRepository.isAvailable.mockResolvedValue(true);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tag)).toBe(true);
    });

    it('should use source result if cache errors', async () => {
      cacheRepository.getAll.mockRejectedValue(new Error('Boom!'));
      const tag = new Tag('MyTag', new Date(0), 'My Description');
      sourceRepository.getAll.mockResolvedValue([tag]);
      sourceRepository.isAvailable.mockResolvedValue(true);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tag)).toBe(true);
    });

    it('should store source result if cache is empty', async () => {
      cacheRepository.getAll.mockResolvedValue([]);
      const tag = new Tag('MyTag', new Date(0), 'My Description');
      sourceRepository.getAll.mockResolvedValue([tag]);
      sourceRepository.isAvailable.mockResolvedValue(true);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepository.saveAll).toHaveBeenCalledTimes(1);

      const calledWith = cacheRepository.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0]).toBeInstanceOf(Tag);
      expect((calledWith[0] as Tag).is(tag)).toBe(true);
    });

    it('should use cache result if source is unavailable', async () => {
      sourceRepository.isAvailable.mockResolvedValue(false);
      const tag = new Tag('MyTag', new Date(0), 'My Description');
      cacheRepository.getAll.mockResolvedValue([tag]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tag)).toBe(true);
    });

    it('should use cache if source errors', async () => {
      sourceRepository.isAvailable.mockResolvedValue(false);
      sourceRepository.getAll.mockRejectedValue(new Error('Boom!'));
      const tag = new Tag('MyTag', new Date(0), 'My Description');
      cacheRepository.getAll.mockResolvedValue([tag]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tag)).toBe(true);
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      sourceRepository.isAvailable.mockResolvedValue(false);
      cacheRepository.getAll.mockResolvedValue([]);
      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const boom = () => cache.getAll(callback);

      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
      );
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      sourceRepository.isAvailable.mockResolvedValue(true);
      const tagFromSource = new Tag('My Tag', new Date(1), 'From Source');
      sourceRepository.getAll.mockResolvedValue([tagFromSource]);
      const tagFromCache = new Tag('My Tag', new Date(0), 'From Cache');
      cacheRepository.getAll.mockResolvedValue([tagFromCache]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tagFromCache)).toBe(true);
      expect(result[0].getDescription()).toBe('From Cache');
      expect(callback).toHaveBeenCalledTimes(1);
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(tagFromSource)).toBe(true);
      expect(calledWith[0].getDescription()).toBe('From Source');
    });

    it('should use cache result and run callback with source result if cache missing new tag', async () => {
      sourceRepository.isAvailable.mockResolvedValue(true);
      const tagFromSourceOne = new Tag(
        'My Tag 1',
        new Date(1),
        'From Source 1'
      );
      const tagFromSourceTwo = new Tag(
        'My Tag 2',
        new Date(1),
        'From Source 2'
      );
      sourceRepository.getAll.mockResolvedValue([
        tagFromSourceOne,
        tagFromSourceTwo,
      ]);
      const tagFromCache = new Tag('My Tag 1', new Date(0), 'From Cache');
      cacheRepository.getAll.mockResolvedValue([tagFromCache]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tagFromCache)).toBe(true);
      expect(result[0].getDescription()).toBe('From Cache');
      expect(callback).toHaveBeenCalledTimes(1);
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith).toHaveLength(2);
      expect(calledWith[0].is(tagFromSourceOne)).toBe(true);
      expect(calledWith[1].is(tagFromSourceTwo)).toBe(true);
    });

    it('should use cache result and run callback with source result if cache has old deleted tag', async () => {
      sourceRepository.isAvailable.mockResolvedValue(true);
      sourceRepository.getAll.mockResolvedValue([]);
      const tagFromCache = new Tag('My Tag', new Date(0), 'From Cache');
      cacheRepository.getAll.mockResolvedValue([tagFromCache]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].is(tagFromCache)).toBe(true);
      expect(result[0].getDescription()).toBe('From Cache');
      expect(callback).toHaveBeenCalledTimes(1);
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith).toHaveLength(0);
    });

    it('should update cached tags if cache is stale', async () => {
      sourceRepository.isAvailable.mockResolvedValue(true);
      const tagFromSource = new Tag('My Tag', new Date(1), 'From Source');
      sourceRepository.getAll.mockResolvedValue([tagFromSource]);
      const tagFromCache = new Tag('My Tag', new Date(0), 'From Cache');
      cacheRepository.getAll.mockResolvedValue([tagFromCache]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepository.update).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepository.update.mock.calls[0][0];
      expect(calledWith.is(tagFromSource)).toBe(true);
    });

    it('should remove deleted cached tags if cache is stale', async () => {
      sourceRepository.isAvailable.mockResolvedValue(true);
      sourceRepository.getAll.mockResolvedValue([]);
      const tagFromCache = new Tag('My Tag', new Date(0), 'From Cache');
      cacheRepository.getAll.mockResolvedValue([tagFromCache]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepository.delete).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepository.delete.mock.calls[0][0];
      expect(calledWith).toBe('My Tag');
    });

    it('should create new cached tags if cache is stale', async () => {
      sourceRepository.isAvailable.mockResolvedValue(true);
      const tagFromSourceOne = new Tag(
        'My Tag 1',
        new Date(1),
        'From Source 1'
      );
      const tagFromSourceTwo = new Tag(
        'My Tag 2',
        new Date(1),
        'From Source 2'
      );
      sourceRepository.getAll.mockResolvedValue([
        tagFromSourceOne,
        tagFromSourceTwo,
      ]);
      const tagFromCache = new Tag('My Tag 1', new Date(0), 'From Cache');
      cacheRepository.getAll.mockResolvedValue([tagFromCache]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepository.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepository.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(tagFromSourceTwo)).toBe(true);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      const tag = new Tag('MyTag', new Date(0), 'My Description');
      sourceRepository.isAvailable.mockResolvedValue(true);
      sourceRepository.getAll.mockRejectedValueOnce(new Error('Boom!'));
      sourceRepository.getAll.mockRejectedValueOnce(new Error('Boom!'));
      sourceRepository.getAll.mockResolvedValueOnce([tag]);

      const cache = new TagCache(sourceRepository, cacheRepository);
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(sourceRepository.getAll).toHaveBeenCalledTimes(3);
    });
  });

  describe('#clearCache', () => {
    it('should call clear cache on cached tag repository', async () => {
      const cache = new TagCache(sourceRepository, cacheRepository);
      await cache.clearCache();
      expect(cacheRepository.clearCache).toHaveBeenCalledTimes(1);
    });
  });
});
