import type {
  CachedAlgorithmRepository,
  Algorithm,
  AlgorithmId,
  AlgorithmRepository,
} from '@/domain/models/Algorithm';
import type { ImageCache } from '@/domain/models/Image';
import {
  sourceAvailableGetMultiple,
  sourceAvailableGetSingle,
} from '@/domain/services/Cache/AlgorithmCache/sourceAvailableGet';
import {
  sourceUnavailableGetMultiple,
  sourceUnavailableGetSingle,
} from '@/domain/services/Cache/AlgorithmCache/sourceUnavailableGet';
import type { GetImageSrcsInHtml } from '@/domain/services/Cache/GetImageSrcsInHtml';
import type { ReplaceImageSrcsInHtml } from '@/domain/services/Cache/ReplaceImageSrcsInHtml';

type CacheInvalidatedCallback<T> = (newValue: T) => void;

class AlgorithmCache {
  constructor(
    private readonly imageCache: ImageCache,
    private readonly algorithmRepository: AlgorithmRepository,
    private readonly cachedAlgorithmRepository: CachedAlgorithmRepository,
    private readonly getImageSrcsInHtml: GetImageSrcsInHtml,
    private readonly replaceImageSrcsInHtml: ReplaceImageSrcsInHtml
  ) {}

  async tryToUpdateCache() {
    if (!(await this.algorithmRepository.isAvailable())) return;
    const getFromRepo = () => this.algorithmRepository.getAll();
    const getFromCache = () => this.cachedAlgorithmRepository.getAll();
    const noop = () => {};
    await sourceAvailableGetMultiple(
      this.imageCache,
      this.cachedAlgorithmRepository,
      this.getImageSrcsInHtml,
      this.replaceImageSrcsInHtml,
      getFromRepo,
      getFromCache,
      noop
    );
  }

  async getById(
    id: AlgorithmId,
    cb: CacheInvalidatedCallback<Algorithm>
  ): Promise<Algorithm> {
    const getFromRepo = () => this.algorithmRepository.getById(id);
    const getFromCache = () => this.cachedAlgorithmRepository.getById(id);
    if (!(await this.algorithmRepository.isAvailable())) {
      return sourceUnavailableGetSingle(
        this.imageCache,
        this.getImageSrcsInHtml,
        this.replaceImageSrcsInHtml,
        getFromCache
      );
    }
    return sourceAvailableGetSingle(
      this.imageCache,
      this.cachedAlgorithmRepository,
      this.getImageSrcsInHtml,
      this.replaceImageSrcsInHtml,
      getFromRepo,
      getFromCache,
      cb
    );
  }

  async getAll(
    cb: CacheInvalidatedCallback<Algorithm[]>
  ): Promise<Algorithm[]> {
    const getFromRepo = () => this.algorithmRepository.getAll();
    const getFromCache = () => this.cachedAlgorithmRepository.getAll();
    if (!(await this.algorithmRepository.isAvailable())) {
      return sourceUnavailableGetMultiple(
        this.imageCache,
        this.getImageSrcsInHtml,
        this.replaceImageSrcsInHtml,
        getFromCache
      );
    }
    return sourceAvailableGetMultiple(
      this.imageCache,
      this.cachedAlgorithmRepository,
      this.getImageSrcsInHtml,
      this.replaceImageSrcsInHtml,
      getFromRepo,
      getFromCache,
      cb
    );
  }

  async getAllShownOnHomeScreen(
    cb: CacheInvalidatedCallback<Algorithm[]>
  ): Promise<Algorithm[]> {
    const getFromRepo = () =>
      this.algorithmRepository.getAllShownOnHomeScreen();
    const getFromCache = () =>
      this.cachedAlgorithmRepository.getAllShownOnHomeScreen();
    if (!(await this.algorithmRepository.isAvailable())) {
      return sourceUnavailableGetMultiple(
        this.imageCache,
        this.getImageSrcsInHtml,
        this.replaceImageSrcsInHtml,
        getFromCache
      );
    }
    return sourceAvailableGetMultiple(
      this.imageCache,
      this.cachedAlgorithmRepository,
      this.getImageSrcsInHtml,
      this.replaceImageSrcsInHtml,
      getFromRepo,
      getFromCache,
      cb
    );
  }

  async clearCache() {
    return this.cachedAlgorithmRepository.clearCache();
  }
}

export { AlgorithmCache };
