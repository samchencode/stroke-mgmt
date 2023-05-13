import { CachedImageMetadata, ImageCache } from '@/domain/models/Image';
import type {
  ImageStore,
  CachedImageMetadataRepository,
} from '@/domain/models/Image';
import { NullImage } from '@/domain/models/Image/NullImage';

describe('ImageCache', () => {
  let imageStoreMock: jest.Mocked<ImageStore>;
  let cachedImageMetadataRepositoryMock: jest.Mocked<CachedImageMetadataRepository>;
  let imageCache: ImageCache;

  beforeEach(() => {
    imageStoreMock = {
      saveFileFromUrl: jest.fn(),
      fileExists: jest.fn(),
      getFileAsBase64Url: jest.fn(),
      deleteAll: jest.fn(),
    };
    cachedImageMetadataRepositoryMock = {
      save: jest.fn(),
      get: jest.fn(),
      clearCache: jest.fn(),
    };

    imageCache = new ImageCache(
      imageStoreMock,
      cachedImageMetadataRepositoryMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveImage', () => {
    it('should call imageStore.saveFileFromUrl and cachedImageMetadataRepository.save', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      imageStoreMock.saveFileFromUrl.mockResolvedValueOnce(metadata);
      cachedImageMetadataRepositoryMock.save.mockResolvedValueOnce();

      await imageCache.saveImage(url);

      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledWith(url);
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledWith(
        metadata
      );
    });
  });

  describe('getCachedImageAsBase64Url', () => {
    it('should return null image if metadata is not found', async () => {
      const url = 'https://example.com/image.jpg';
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(null);

      const result = await imageCache.getCachedImageAsBase64Url(url);

      expect(result).toBeInstanceOf(NullImage);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).not.toHaveBeenCalled();
      expect(imageStoreMock.getFileAsBase64Url).not.toHaveBeenCalled();
    });

    it('should return null image if file does not exist', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(false);

      const result = await imageCache.getCachedImageAsBase64Url(url);

      expect(result).toBeInstanceOf(NullImage);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(
        metadata.getFilePath()
      );
      expect(imageStoreMock.getFileAsBase64Url).not.toHaveBeenCalled();
    });

    it('should return the image file as a base64 URL if the file exists', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      const base64Url = 'data:image/jpeg;base64,...';
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);
      imageStoreMock.getFileAsBase64Url.mockResolvedValueOnce(base64Url);

      const result = await imageCache.getCachedImageAsBase64Url(url);

      expect(result.getUri()).toBe(base64Url);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(
        metadata.getFilePath()
      );
      expect(imageStoreMock.getFileAsBase64Url).toHaveBeenCalledWith(metadata);
    });
  });

  describe('getCachedImageAsBase64UrlOrSaveAndReturnSourceImage', () => {
    it('should return source image if metadata is not found', async () => {
      const url = 'https://example.com/image.jpg';
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(null);

      const result =
        await imageCache.getCachedImageAsBase64UrlOrSaveAndReturnSourceImage(
          url
        );
      await new Promise(process.nextTick);
      expect(result.getUri()).toBe(url);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).not.toHaveBeenCalled();
      expect(imageStoreMock.getFileAsBase64Url).not.toHaveBeenCalled();
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });

    it('should return source image if file does not exist', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(false);

      const result =
        await imageCache.getCachedImageAsBase64UrlOrSaveAndReturnSourceImage(
          url
        );
      await new Promise(process.nextTick);
      expect(result.getUri()).toBe(url);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(
        metadata.getFilePath()
      );
      expect(imageStoreMock.getFileAsBase64Url).not.toHaveBeenCalled();
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });

    it('should return the image file as a base64 URL if the file exists', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      const base64Url = 'data:image/jpeg;base64,...';
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);
      imageStoreMock.getFileAsBase64Url.mockResolvedValueOnce(base64Url);

      const result =
        await imageCache.getCachedImageAsBase64UrlOrSaveAndReturnSourceImage(
          url
        );

      await new Promise(process.nextTick);
      expect(result.getUri()).toBe(base64Url);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(
        metadata.getFilePath()
      );
      expect(imageStoreMock.getFileAsBase64Url).toHaveBeenCalledWith(metadata);
      expect(cachedImageMetadataRepositoryMock.save).not.toHaveBeenCalled();
      expect(imageStoreMock.saveFileFromUrl).not.toHaveBeenCalled();
    });
  });

  describe('getCachedImageAsFileUri', () => {
    it('should return null image if the image metadata is not found in the repository', async () => {
      const url = 'http://example.com/image.jpg';
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(null);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);

      const result = await imageCache.getCachedImageAsFileUri(url);
      expect(result).toBeInstanceOf(NullImage);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).not.toHaveBeenCalled();
    });

    it('should return null image if the image file is not found in the store', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(false);

      const result = await imageCache.getCachedImageAsFileUri(url);
      expect(result).toBeInstanceOf(NullImage);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(filepath);
    });

    it('should return the file path if the image metadata and file are found', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);

      const result = await imageCache.getCachedImageAsFileUri(url);

      expect(result.getUri()).toEqual(filepath);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(filepath);
    });
  });

  describe('getCachedImageAsFileUriOrSaveAndReturnSourceImage', () => {
    it('should return source image if the image metadata is not found in the repository', async () => {
      const url = 'http://example.com/image.jpg';
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(null);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);

      const result =
        await imageCache.getCachedImageAsFileUriOrSaveAndReturnSourceImage(url);

      await new Promise(process.nextTick);
      expect(result.getUri()).toBe(url);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).not.toHaveBeenCalled();
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });

    it('should return source image if the image file is not found in the store', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(false);

      const result =
        await imageCache.getCachedImageAsFileUriOrSaveAndReturnSourceImage(url);

      await new Promise(process.nextTick);
      expect(result.getUri()).toBe(url);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(filepath);
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });

    it('should return the file path if the image metadata and file are found', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);

      const result =
        await imageCache.getCachedImageAsFileUriOrSaveAndReturnSourceImage(url);

      await new Promise(process.nextTick);
      expect(result.getUri()).toEqual(filepath);
      expect(cachedImageMetadataRepositoryMock.get).toHaveBeenCalledWith(url);
      expect(imageStoreMock.fileExists).toHaveBeenCalledWith(filepath);
      expect(cachedImageMetadataRepositoryMock.save).not.toHaveBeenCalled();
      expect(imageStoreMock.saveFileFromUrl).not.toHaveBeenCalled();
    });
  });

  describe('clearCache', () => {
    it('should delete all cached images and metadata', async () => {
      const imageCacheToDelete = new ImageCache(
        imageStoreMock,
        cachedImageMetadataRepositoryMock
      );

      await imageCacheToDelete.clearCache();

      expect(imageStoreMock.deleteAll).toHaveBeenCalled();
      expect(cachedImageMetadataRepositoryMock.clearCache).toHaveBeenCalled();
    });
  });

  describe('saveImageIfNotExists', () => {
    it('should save image if it does not exist in metadata nor store', async () => {
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(null);
      imageStoreMock.fileExists.mockResolvedValueOnce(false);

      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      imageStoreMock.saveFileFromUrl.mockResolvedValueOnce(metadata);
      cachedImageMetadataRepositoryMock.save.mockResolvedValueOnce();

      await imageCache.saveImageIfNotExists(url);
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });

    it('should save image to repo if the image metadata is not found in the repository', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      imageStoreMock.saveFileFromUrl.mockResolvedValueOnce(metadata);
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(null);
      imageStoreMock.fileExists.mockResolvedValueOnce(true);

      await imageCache.saveImageIfNotExists(url);
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });

    it('should save image to store if the image file is not found in the store', async () => {
      const url = 'http://example.com/image.jpg';
      const filepath = '/path/to/image.jpg';
      const metadata = new CachedImageMetadata(url, filepath, 'image/jpeg');
      cachedImageMetadataRepositoryMock.get.mockResolvedValueOnce(metadata);
      imageStoreMock.fileExists.mockResolvedValueOnce(false);

      await imageCache.saveImageIfNotExists(url);
      expect(cachedImageMetadataRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(imageStoreMock.saveFileFromUrl).toHaveBeenCalledTimes(1);
    });
  });
});
