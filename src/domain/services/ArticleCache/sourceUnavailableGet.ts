import { SourceUnavailableCacheEmptyError } from '@/domain/services/ArticleCache/SourceUnavailableCacheEmptyError';
import type { Article, CachedArticleRepository } from '@/domain/models/Article';
import type { ImageCache } from '@/domain/models/Image';
import { Image } from '@/domain/models/Image';
import { NullImage } from '@/domain/models/Image/NullImage';

type Getter<T> = () => Promise<T>;

async function getAndAddCachedThumbnailForArticle(
  imageCache: ImageCache,
  article: Article
) {
  const thumbnail = article.getThumbnail();
  if (!thumbnail) return article;
  const fileUri = await imageCache.getCachedImageAsFileUri(thumbnail.getUri());
  if (!fileUri) {
    return article.clone({ thumbnail: new NullImage() });
  }
  return article.clone({ thumbnail: new Image(fileUri) });
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
