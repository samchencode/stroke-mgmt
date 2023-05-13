import { SourceUnavailableCacheEmptyError } from '@/domain/services/Cache/SourceUnavailableCacheEmptyError';
import type { Article, CachedArticleRepository } from '@/domain/models/Article';
import type { ImageCache } from '@/domain/models/Image';

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

async function sourceUnavailableGetMultiple(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  cacheGetter: Getter<Article[]>
) {
  if (await cacheRepository.isEmpty())
    throw new SourceUnavailableCacheEmptyError();
  const cacheResult = await cacheGetter();
  return getAndAddCachedThumbnailForArticles(imageCache, cacheResult);
}

async function sourceUnavailableGetSingle(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  cacheGetter: Getter<Article>
) {
  const [article] = await sourceUnavailableGetMultiple(
    imageCache,
    cacheRepository,
    () => cacheGetter().then((r) => [r])
  );
  return article;
}

export { sourceUnavailableGetMultiple, sourceUnavailableGetSingle };
