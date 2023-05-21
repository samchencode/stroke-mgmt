import {
  AlgorithmId,
  AlgorithmNotFoundError,
  CachedAlgorithmNotFoundError,
  NullAlgorithm,
  TextAlgorithm,
  ScoredAlgorithm,
  AlgorithmInfo,
  Outcome,
  YesNoSwitch,
  SwitchId,
} from '@/domain/models/Algorithm';
import type {
  CachedAlgorithmRepository,
  AlgorithmRepository,
} from '@/domain/models/Algorithm';
import type {
  CachedImageMetadataRepository,
  ImageStore,
} from '@/domain/models/Image';
import { Image, ImageCache } from '@/domain/models/Image';
import { NullImage } from '@/domain/models/Image/NullImage';
import {
  SourceUnavailableEmptyCacheResultError,
  AlgorithmCache,
} from '@/domain/services/Cache';

describe('AlgorithmCache', () => {
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
    getAll: jest.fn(),
    getById: jest.fn(),
    getAllShownOnHomeScreen: jest.fn(),
    clearCache: jest.fn(),
    isAvailable: jest.fn(),
  } satisfies CachedAlgorithmRepository;

  const algorithmRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getAllShownOnHomeScreen: jest.fn(),
    isAvailable: jest.fn(),
  } satisfies AlgorithmRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    getImageSrcsInHtml.mockReturnValue([]);
    replaceImageSrcsInHtml.mockImplementation((map, body) => body);
  });

  describe('Instantiation', () => {
    it('should be created with imageCache and source and cache repos', () => {
      const create = () =>
        new AlgorithmCache(
          imageCache,
          algorithmRepo,
          cacheRepo,
          getImageSrcsInHtml,
          replaceImageSrcsInHtml
        );
      expect(create).not.toThrow();
    });
  });

  describe('#getAllShownOnHomeScreen', () => {
    it('should use source result if cache response is empty', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should use source result if cache errors', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      cacheRepo.getAllShownOnHomeScreen.mockRejectedValue(new Error('Boom!'));

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should store source result if cache response is empty', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(algorithm)).toBe(true);
    });

    it('should use cache result if source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should use cache if source errors', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      algorithmRepo.getAllShownOnHomeScreen.mockRejectedValue(
        new Error('Boom!')
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const boom = () => cache.getAllShownOnHomeScreen(callback);

      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
      );
    });

    it('should throw error if cache throws error and source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.getAllShownOnHomeScreen.mockRejectedValue(new Error('Boom!'));

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const boom = () => cache.getAllShownOnHomeScreen(callback);

      await expect(boom).rejects.toThrow('Boom!');
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(results).toHaveLength(1);
      expect(results[0].is(cachedAlgorithm)).toBe(true);
      expect(results[0].getTitle()).toBe('My Cached Title');

      expect(callback).toHaveBeenCalledTimes(1);
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(sourceAlgorithm)).toBe(true);
      expect(calledWith[0].getTitle()).toBe('My Source Title');
    });

    it('should update cached algorithms if cache is stale', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.update).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.update.mock.calls[0][0];
      expect(calledWith.is(sourceAlgorithm)).toBe(true);
      expect(calledWith.getTitle()).toBe('My Source Title');
    });

    it('should save new algorithm not found in cache', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAndSourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached and Source Title',
        body: '<h1>My Cached and Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached and Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAndSourceAlgorithm = new TextAlgorithm({
        info: cachedAndSourceAlgorithmInfo,
      });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([
        cachedAndSourceAlgorithm,
      ]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('2'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        cachedAndSourceAlgorithm,
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(sourceAlgorithm)).toBe(true);
      expect(calledWith[0].getTitle()).toBe('My Source Title');
    });

    it('should remove deleted cached algorithm and calls callback with empty result', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.delete).toHaveBeenCalledTimes(1);
      const deleteCalledWith = cacheRepo.delete.mock.calls[0][0];
      expect(deleteCalledWith.is(new AlgorithmId('1'))).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
      const callbackCalledWith = callback.mock.calls[0][0];
      expect(callbackCalledWith).toHaveLength(0);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockRejectedValueOnce(
        new Error('Boom!')
      );
      algorithmRepo.getAllShownOnHomeScreen.mockRejectedValueOnce(
        new Error('Boom!')
      );
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValueOnce([
        sourceAlgorithm,
      ]);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(algorithmRepo.getAllShownOnHomeScreen).toHaveBeenCalledTimes(3);
    });

    it('should add image to cached algorithm thumbnail', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        sourceAlgorithm,
      ]);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should add image to cached algorithm thumbnail despite source unavailability', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
    });

    it('should add default image to algorithm thumbnail if source unavailable and file not found', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );

      const callback = jest.fn();
      const result = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail()).toBeInstanceOf(NullImage);
    });

    it('should use src image to algorithm thumbnail if source available and cached file not found', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cachedAlgorithm]);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );

      const callback = jest.fn();
      const result = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe(
        'https://www.foobar.com/img.png'
      );
    });

    it('should save algorithm thumbnail if cache stale', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(1);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img.png'
      );
    });

    it('should download algorithm thumbnail if cached version not found', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const cacheAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cache Title',
        body: '<h1>My Cache Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cache Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cacheAlgorithm = new TextAlgorithm({ info: cacheAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cacheAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(1);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img.png'
      );
    });

    it('should update algorithm thumbnail if cache stale', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const cacheAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cache Title',
        body: '<h1>My Cache Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Cache Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cacheAlgorithm = new TextAlgorithm({ info: cacheAlgorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([cacheAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v2.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      // called once when loading cache and once when saving new source result
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(2);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img-v2.png'
      );
    });

    it('should replace image src with local image in cached algorithm body', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].getBody()).toBe('<img src="data:image/png;base64,">');
    });

    it('should replace image src with local image in cached algorithm outcome body', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `My Body`,
        outcomes: [
          new Outcome({
            title: 'First Outcome',
            body: `<img src="${imageUrl}">`,
          }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      const outcomes = results[0].getOutcomes();
      expect(outcomes[0].getBody()).toBe('<img src="data:image/png;base64,">');
    });

    it('should replace image src with local image in cached algorithm switch description', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `My Body`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const algorithmSwitches = [
        new YesNoSwitch({
          id: new SwitchId('0'),
          label: 'My Switch',
          valueIfActive: 1,
          description: `<img src="${imageUrl}">`,
        }),
      ];

      const algorithm = new ScoredAlgorithm({
        info: algorithmInfo,
        switches: algorithmSwitches,
      });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(ScoredAlgorithm);
      const switches = (results[0] as ScoredAlgorithm).getSwitches();
      expect(switches[0].getDescription()).toBe(
        '<img src="data:image/png;base64,">'
      );
    });

    it('should replace image src with default (aka null) image if image not found and source unavailble', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64Url'
      );

      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].getBody()).toBe(
        `<img src="${new NullImage().getUri()}">`
      );
    });

    it('should not replace image src in cached algorithm if image not found and source available', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);
      algorithmRepo.getAllShownOnHomeScreen.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAllShownOnHomeScreen(callback);

      expect(results).toHaveLength(1);
      expect(results[0].getBody()).toBe(`<img src="${imageUrl}">`);
    });
  });

  describe('#getById', () => {
    it('should use source result if cache response is empty', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getById.mockResolvedValue(algorithm);
      cacheRepo.getById.mockRejectedValue(
        new CachedAlgorithmNotFoundError(new AlgorithmId('1'))
      );

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.is(algorithm)).toBe(true);
    });

    it('should use source result if cache errors', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getById.mockResolvedValue(algorithm);
      cacheRepo.getById.mockRejectedValue(new Error('Boom!'));

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.is(algorithm)).toBe(true);
    });

    it('should store source result if cache response is empty', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getById.mockResolvedValue(algorithm);
      cacheRepo.getById.mockRejectedValue(
        new CachedAlgorithmNotFoundError(new AlgorithmId('1'))
      );

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(algorithm)).toBe(true);
    });

    it('should use cache result if source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);

      expect(result.is(algorithm)).toBe(true);
    });

    it('should use cache if source errors', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      algorithmRepo.getById.mockRejectedValue(new Error('Boom!'));
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);

      expect(result.is(algorithm)).toBe(true);
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.getById.mockRejectedValue(
        new CachedAlgorithmNotFoundError(new AlgorithmId('1'))
      );

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const boom = () => cache.getById(new AlgorithmId('1'), callback);

      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
      );
    });

    it('should throw error if cache throws error and source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.getById.mockRejectedValue(new Error('Boom!'));

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const boom = () => cache.getById(new AlgorithmId('1'), callback);

      await expect(boom).rejects.toThrow('Boom!');
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.is(cachedAlgorithm)).toBe(true);
      expect(result.getTitle()).toBe('My Cached Title');

      expect(callback).toHaveBeenCalledTimes(1);
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith.is(sourceAlgorithm)).toBe(true);
      expect(calledWith.getTitle()).toBe('My Source Title');
    });

    it('should update cached algorithms if cache is stale', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.update).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.update.mock.calls[0][0];
      expect(calledWith.is(sourceAlgorithm)).toBe(true);
      expect(calledWith.getTitle()).toBe('My Source Title');
    });

    it('should save new algorithm not found in cache', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      cacheRepo.getById.mockRejectedValue(
        new CachedAlgorithmNotFoundError(new AlgorithmId('2'))
      );
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('2'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('2'), callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(sourceAlgorithm)).toBe(true);
      expect(calledWith[0].getTitle()).toBe('My Source Title');
    });

    it('should remove deleted cached algorithm and calls callback with empty result', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);
      algorithmRepo.getById.mockRejectedValue(
        new AlgorithmNotFoundError(new AlgorithmId('1'))
      );

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.delete).toHaveBeenCalledTimes(1);
      const deleteCalledWith = cacheRepo.delete.mock.calls[0][0];
      expect(deleteCalledWith.is(new AlgorithmId('1'))).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
      const callbackCalledWith = callback.mock.calls[0][0];
      expect(callbackCalledWith).toBeInstanceOf(NullAlgorithm);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockRejectedValueOnce(new Error('Boom!'));
      algorithmRepo.getById.mockRejectedValueOnce(new Error('Boom!'));
      algorithmRepo.getById.mockResolvedValueOnce([sourceAlgorithm]);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(algorithmRepo.getById).toHaveBeenCalledTimes(3);
    });

    it('should add image to cached algorithm thumbnail', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.getThumbnail().getUri()).toBe('file://my-img.png');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should add image to cached algorithm thumbnail despite source unavailability', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.getThumbnail().getUri()).toBe('file://my-img.png');
    });

    it('should add default image to algorithm thumbnail if source unavailable and file not found', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );

      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.getThumbnail()).toBeInstanceOf(NullImage);
    });

    it('should use src image to algorithm thumbnail if source available and cached file not found', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cachedAlgorithm);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );

      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(result.getThumbnail().getUri()).toBe(
        'https://www.foobar.com/img.png'
      );
    });

    it('should save algorithm thumbnail if cache stale', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getById.mockRejectedValue(
        new CachedAlgorithmNotFoundError(new AlgorithmId('1'))
      );
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(1);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img.png'
      );
    });

    it('should download algorithm thumbnail if cached version not found', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const cacheAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cache Title',
        body: '<h1>My Cache Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cache Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cacheAlgorithm = new TextAlgorithm({ info: cacheAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cacheAlgorithm);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(1);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img.png'
      );
    });

    it('should update algorithm thumbnail if cache stale', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const cacheAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cache Title',
        body: '<h1>My Cache Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Cache Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cacheAlgorithm = new TextAlgorithm({ info: cacheAlgorithmInfo });
      cacheRepo.getById.mockResolvedValue(cacheAlgorithm);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v2.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getById.mockResolvedValue(sourceAlgorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      // called once when loading cache and once when saving new source result
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(2);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img-v2.png'
      );
    });

    it('should replace image src with local image in cached algorithm body', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getById.mockResolvedValue(algorithm);
      algorithmRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(result.getBody()).toBe('<img src="data:image/png;base64,">');
    });

    it('should replace image src with local image in cached algorithm outcome body', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `My Body`,
        outcomes: [
          new Outcome({
            title: 'First Outcome',
            body: `<img src="${imageUrl}">`,
          }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getById.mockResolvedValue(algorithm);
      algorithmRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      const outcomes = result.getOutcomes();
      expect(outcomes[0].getBody()).toBe('<img src="data:image/png;base64,">');
    });

    it('should replace image src with local image in cached algorithm switch description', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `My Body`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const algorithmSwitches = [
        new YesNoSwitch({
          id: new SwitchId('0'),
          label: 'My Switch',
          valueIfActive: 1,
          description: `<img src="${imageUrl}">`,
        }),
      ];

      const algorithm = new ScoredAlgorithm({
        info: algorithmInfo,
        switches: algorithmSwitches,
      });
      cacheRepo.getById.mockResolvedValue(algorithm);
      algorithmRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ScoredAlgorithm);
      const switches = (result as ScoredAlgorithm).getSwitches();
      expect(switches[0].getDescription()).toBe(
        '<img src="data:image/png;base64,">'
      );
    });

    it('should replace image src with default (aka null) image if image not found and source unavailble', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64Url'
      );

      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(result.getBody()).toBe(`<img src="${new NullImage().getUri()}">`);
    });

    it('should not replace image src in cached algorithm if image not found and source available', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getById.mockResolvedValue(algorithm);
      algorithmRepo.getById.mockResolvedValue(algorithm);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getById(new AlgorithmId('1'), callback);

      expect(result.getBody()).toBe(`<img src="${imageUrl}">`);
    });
  });

  describe('#getAll', () => {
    it('should use source result if cache response is empty', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([algorithm]);
      cacheRepo.getAll.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should use source result if cache errors', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([algorithm]);
      cacheRepo.getAll.mockRejectedValue(new Error('Boom!'));

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should store source result if cache response is empty', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([algorithm]);
      cacheRepo.getAll.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(algorithm)).toBe(true);
    });

    it('should use cache result if source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should use cache if source errors', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      algorithmRepo.getAll.mockRejectedValue(new Error('Boom!'));
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: '<h1>My Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);

      expect(results).toHaveLength(1);
      expect(results[0].is(algorithm)).toBe(true);
    });

    it('should throw error if cache response is empty and source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.getAll.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const boom = () => cache.getAll(callback);

      await expect(boom).rejects.toBeInstanceOf(
        SourceUnavailableEmptyCacheResultError
      );
    });

    it('should throw error if cache throws error and source is unavailable', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cacheRepo.getAll.mockRejectedValue(new Error('Boom!'));

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const boom = () => cache.getAll(callback);

      await expect(boom).rejects.toThrow('Boom!');
    });

    it('should use cache result and run callback with source result if cache is stale', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([sourceAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(results).toHaveLength(1);
      expect(results[0].is(cachedAlgorithm)).toBe(true);
      expect(results[0].getTitle()).toBe('My Cached Title');

      expect(callback).toHaveBeenCalledTimes(1);
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(sourceAlgorithm)).toBe(true);
      expect(calledWith[0].getTitle()).toBe('My Source Title');
    });

    it('should update cached algorithms if cache is stale', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([sourceAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.update).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.update.mock.calls[0][0];
      expect(calledWith.is(sourceAlgorithm)).toBe(true);
      expect(calledWith.getTitle()).toBe('My Source Title');
    });

    it('should save new algorithm not found in cache', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAndSourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached and Source Title',
        body: '<h1>My Cached and Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached and Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAndSourceAlgorithm = new TextAlgorithm({
        info: cachedAndSourceAlgorithmInfo,
      });
      cacheRepo.getAll.mockResolvedValue([cachedAndSourceAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('2'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([
        cachedAndSourceAlgorithm,
        sourceAlgorithm,
      ]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.saveAll).toHaveBeenCalledTimes(1);
      const calledWith = cacheRepo.saveAll.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].is(sourceAlgorithm)).toBe(true);
      expect(calledWith[0].getTitle()).toBe('My Source Title');
    });

    it('should remove deleted cached algorithm and calls callback with empty result', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);
      algorithmRepo.getAll.mockResolvedValue([]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(cacheRepo.delete).toHaveBeenCalledTimes(1);
      const deleteCalledWith = cacheRepo.delete.mock.calls[0][0];
      expect(deleteCalledWith.is(new AlgorithmId('1'))).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
      const callbackCalledWith = callback.mock.calls[0][0];
      expect(callbackCalledWith).toHaveLength(0);
    });

    it('should try source 3 times in case of failure before throwing an error', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockRejectedValueOnce(new Error('Boom!'));
      algorithmRepo.getAll.mockRejectedValueOnce(new Error('Boom!'));
      algorithmRepo.getAll.mockResolvedValueOnce([sourceAlgorithm]);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(algorithmRepo.getAll).toHaveBeenCalledTimes(3);
    });

    it('should add image to cached algorithm thumbnail', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([sourceAlgorithm]);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should add image to cached algorithm thumbnail despite source unavailability', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);

      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      const cachedImage = new Image('file://my-img.png');
      getCachedImageAsFileUriSpy.mockResolvedValue(cachedImage);
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe('file://my-img.png');
    });

    it('should add default image to algorithm thumbnail if source unavailable and file not found', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );

      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail()).toBeInstanceOf(NullImage);
    });

    it('should use src image to algorithm thumbnail if source available and cached file not found', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      const cachedAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cached Title',
        body: '<h1>My Cached Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cached Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cachedAlgorithm = new TextAlgorithm({ info: cachedAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cachedAlgorithm]);
      const getCachedImageAsFileUriSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsFileUri'
      );
      getCachedImageAsFileUriSpy.mockResolvedValue(new NullImage());

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );

      const callback = jest.fn();
      const result = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(result).toHaveLength(1);
      expect(result[0].getThumbnail().getUri()).toBe(
        'https://www.foobar.com/img.png'
      );
    });

    it('should save algorithm thumbnail if cache stale', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      cacheRepo.getAll.mockResolvedValue([]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([sourceAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(1);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img.png'
      );
    });

    it('should download algorithm thumbnail if cached version not found', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const cacheAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cache Title',
        body: '<h1>My Cache Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Cache Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cacheAlgorithm = new TextAlgorithm({ info: cacheAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cacheAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([sourceAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(callback).not.toHaveBeenCalled();
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(1);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img.png'
      );
    });

    it('should update algorithm thumbnail if cache stale', async () => {
      cachedImageMetadataRepository.get.mockResolvedValue(null);
      algorithmRepo.isAvailable.mockResolvedValue(true);
      imageStore.fileExists.mockResolvedValue(false);

      cacheRepo.isEmpty.mockResolvedValue(false);
      const cacheAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Cache Title',
        body: '<h1>My Cache Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Cache Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const cacheAlgorithm = new TextAlgorithm({ info: cacheAlgorithmInfo });
      cacheRepo.getAll.mockResolvedValue([cacheAlgorithm]);
      const sourceAlgorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Source Title',
        body: '<h1>My Source Algorithm Body</h1>',
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v2.png'),
        summary: 'My Source Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(10),
      });
      const sourceAlgorithm = new TextAlgorithm({ info: sourceAlgorithmInfo });
      algorithmRepo.getAll.mockResolvedValue([sourceAlgorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      await cache.getAll(callback);
      await new Promise(process.nextTick);

      // called once when loading cache and once when saving new source result
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledTimes(2);
      expect(imageStore.saveFileFromUrl).toHaveBeenCalledWith(
        'https://www.foobar.com/img-v2.png'
      );
    });

    it('should replace image src with local image in cached algorithm body', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAll.mockResolvedValue([algorithm]);
      algorithmRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].getBody()).toBe('<img src="data:image/png;base64,">');
    });

    it('should replace image src with local image in cached algorithm outcome body', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `My Body`,
        outcomes: [
          new Outcome({
            title: 'First Outcome',
            body: `<img src="${imageUrl}">`,
          }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAll.mockResolvedValue([algorithm]);
      algorithmRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      const outcomes = results[0].getOutcomes();
      expect(outcomes[0].getBody()).toBe('<img src="data:image/png;base64,">');
    });

    it('should replace image src with local image in cached algorithm switch description', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64UrlOrSaveAndReturnSourceImage'
      );
      getCachedImageAsBase64UrlSpy.mockResolvedValue(
        new Image('data:image/png;base64,')
      );
      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );
      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `My Body`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img-v1.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const algorithmSwitches = [
        new YesNoSwitch({
          id: new SwitchId('0'),
          label: 'My Switch',
          valueIfActive: 1,
          description: `<img src="${imageUrl}">`,
        }),
      ];

      const algorithm = new ScoredAlgorithm({
        info: algorithmInfo,
        switches: algorithmSwitches,
      });
      cacheRepo.getAll.mockResolvedValue([algorithm]);
      algorithmRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);
      await new Promise(process.nextTick);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(ScoredAlgorithm);
      const switches = (results[0] as ScoredAlgorithm).getSwitches();
      expect(switches[0].getDescription()).toBe(
        '<img src="data:image/png;base64,">'
      );
    });

    it('should replace image src with default (aka null) image if image not found and source unavailble', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(false);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      const getCachedImageAsBase64UrlSpy = jest.spyOn(
        imageCache,
        'getCachedImageAsBase64Url'
      );

      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);

      expect(getCachedImageAsBase64UrlSpy).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].getBody()).toBe(
        `<img src="${new NullImage().getUri()}">`
      );
    });

    it('should not replace image src in cached algorithm if image not found and source available', async () => {
      algorithmRepo.isAvailable.mockResolvedValue(true);
      cachedImageMetadataRepository.get.mockResolvedValue(null);

      const imageUrl = 'https://www.foobar.com/my-post-img.png';
      getImageSrcsInHtml.mockReturnValue([imageUrl]);
      replaceImageSrcsInHtml.mockImplementation(
        (map) => `<img src="${map[imageUrl]}">`
      );

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'My Title',
        body: `<img src="${imageUrl}">`,
        outcomes: [
          new Outcome({ title: 'First Outcome', body: 'First Outcome Body' }),
          new Outcome({ title: 'Second Outcome', body: 'Second Outcome Body' }),
        ],
        thumbnail: new Image('https://www.foobar.com/img.png'),
        summary: 'My Algorithm Summary',
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const algorithm = new TextAlgorithm({ info: algorithmInfo });
      cacheRepo.getAll.mockResolvedValue([algorithm]);
      algorithmRepo.getAll.mockResolvedValue([algorithm]);

      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      const callback = jest.fn();
      const results = await cache.getAll(callback);

      expect(results).toHaveLength(1);
      expect(results[0].getBody()).toBe(`<img src="${imageUrl}">`);
    });
  });

  describe('#clearCache', () => {
    it('should clear the cache', async () => {
      const cache = new AlgorithmCache(
        imageCache,
        algorithmRepo,
        cacheRepo,
        getImageSrcsInHtml,
        replaceImageSrcsInHtml
      );
      await cache.clearCache();
      expect(cacheRepo.clearCache).toHaveBeenCalledTimes(1);
    });
  });
});
