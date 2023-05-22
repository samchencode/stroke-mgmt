import type { Algorithm } from '@/domain/models/Algorithm';
import { CachedAlgorithmNotFoundError } from '@/domain/models/Algorithm';
import type { ImageCache } from '@/domain/models/Image';
import { SourceUnavailableEmptyCacheResultError } from '@/domain/services/Cache/SourceUnavailableEmptyCacheResultError';
import type { GetImageSrcsInHtml } from '@/domain/services/Cache/GetImageSrcsInHtml';
import type { ReplaceImageSrcsInHtml } from '@/domain/services/Cache/ReplaceImageSrcsInHtml';
import type { Getter } from '@/domain/services/Cache/Getter';
import { getAndAddCachedImagesForAlgorithms } from '@/domain/services/Cache/AlgorithmCache/getAndAddCachedImagesForAlgorithms';

async function getAndAddCachedThumbnailForAlgorithm(
  imageCache: ImageCache,
  algorithm: Algorithm
) {
  const thumbnail = algorithm.getThumbnail();
  if (!thumbnail) return algorithm;
  const image = await imageCache.getCachedImageAsFileUri(thumbnail.getUri());
  return algorithm.setMetadata({ thumbnail: image });
}

async function getAndAddCachedThumbnailForAlgorithms(
  imageCache: ImageCache,
  cacheResult: Algorithm[]
) {
  const promises = cacheResult.map((v) =>
    getAndAddCachedThumbnailForAlgorithm(imageCache, v)
  );
  return Promise.all(promises);
}

async function sourceUnavailableGetMultiple(
  imageCache: ImageCache,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  cacheGetter: Getter<Algorithm[]>
) {
  try {
    const cacheResult = await cacheGetter();
    const cacheResultIsEmpty = cacheResult.length === 0;
    if (cacheResultIsEmpty) {
      throw new SourceUnavailableEmptyCacheResultError();
    }

    const cacheResultWithThumbnails =
      await getAndAddCachedThumbnailForAlgorithms(imageCache, cacheResult);
    return await getAndAddCachedImagesForAlgorithms(
      (url) => imageCache.getCachedImageAsBase64Url(url),
      getImageSrcsInHtml,
      replaceImageSrcsInHtml,
      cacheResultWithThumbnails
    );
  } catch (e) {
    if (e instanceof CachedAlgorithmNotFoundError) {
      throw new SourceUnavailableEmptyCacheResultError();
    } else {
      throw e;
    }
  }
}

async function sourceUnavailableGetSingle(
  imageCache: ImageCache,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  cacheGetter: Getter<Algorithm>
) {
  const [algorithm] = await sourceUnavailableGetMultiple(
    imageCache,
    getImageSrcsInHtml,
    replaceImageSrcsInHtml,
    () => cacheGetter().then((r) => [r])
  );
  return algorithm;
}

export { sourceUnavailableGetMultiple, sourceUnavailableGetSingle };
