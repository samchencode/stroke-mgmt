import { SourceUnavailableCacheEmptyError } from '@/domain/services/Cache/SourceUnavailableCacheEmptyError';
import type { Article, CachedArticleRepository } from '@/domain/models/Article';
import type { ImageCache } from '@/domain/models/Image';
import type { GetImageSrcsInHtml } from '@/domain/services/Cache/GetImageSrcsInHtml';
import type { ReplaceImageSrcsInHtml } from '@/domain/services/Cache/ReplaceImageSrcsInHtml';

type Getter<T> = () => Promise<T>;

async function getAndAddCachedThumbnailForArticle(
  imageCache: ImageCache,
  article: Article
) {
  const thumbnail = article.getThumbnail();
  if (!thumbnail) return article;
  const image = await imageCache.getCachedImageAsFileUri(thumbnail.getUri());
  return article.clone({ thumbnail: image });
}

async function getAndAddCachedThumbnailForArticles(
  imageCache: ImageCache,
  cacheResult: Article[]
) {
  const promises = cacheResult.map((v) =>
    getAndAddCachedThumbnailForArticle(imageCache, v)
  );
  return Promise.all(promises);
}

async function getAndAddCachedImagesForArticle(
  imageCache: ImageCache,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  article: Article
): Promise<Article> {
  const imageUrls = getImageSrcsInHtml(article.getHtml()).filter((v) =>
    v.match(/^https?:\/\//)
  );
  const promises = imageUrls.map((v) =>
    imageCache
      .getCachedImageAsBase64Url(v)
      .then((b64) => [v, b64.getUri()] as const)
  );
  const imagesUrlsAndCacheResults = await Promise.all(promises);
  const uriMap = Object.fromEntries(imagesUrlsAndCacheResults);
  const newHtml = replaceImageSrcsInHtml(uriMap, article.getHtml());
  return article.clone({ html: newHtml });
}

async function getAndAddCachedImagesForArticles(
  imageCache: ImageCache,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  articles: Article[]
): Promise<Article[]> {
  const promises = articles.map((a) =>
    getAndAddCachedImagesForArticle(
      imageCache,
      getImageSrcsInHtml,
      replaceImageSrcsInHtml,
      a
    )
  );
  return Promise.all(promises);
}

async function sourceUnavailableGetMultiple(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  cacheGetter: Getter<Article[]>
) {
  if (await cacheRepository.isEmpty())
    throw new SourceUnavailableCacheEmptyError();
  const cacheResult = await cacheGetter();
  const cacheResultWithThumbnails = await getAndAddCachedThumbnailForArticles(
    imageCache,
    cacheResult
  );
  return getAndAddCachedImagesForArticles(
    imageCache,
    getImageSrcsInHtml,
    replaceImageSrcsInHtml,
    cacheResultWithThumbnails
  );
}

async function sourceUnavailableGetSingle(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  cacheGetter: Getter<Article>
) {
  const [article] = await sourceUnavailableGetMultiple(
    imageCache,
    cacheRepository,
    getImageSrcsInHtml,
    replaceImageSrcsInHtml,
    () => cacheGetter().then((r) => [r])
  );
  return article;
}

export { sourceUnavailableGetMultiple, sourceUnavailableGetSingle };
