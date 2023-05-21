import type {
  Algorithm,
  AlgorithmVisitor,
  ScoredAlgorithm,
  TextAlgorithm,
} from '@/domain/models/Algorithm';
import type { Image } from '@/domain/models/Image';
import type { GetImageSrcsInHtml } from '@/domain/services/Cache/GetImageSrcsInHtml';
import type { ReplaceImageSrcsInHtml } from '@/domain/services/Cache/ReplaceImageSrcsInHtml';

async function getAndAddCachedImagesForAlgorithm(
  getCachedImage: (url: string) => Promise<Image>,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  algorithm: Algorithm
): Promise<Algorithm> {
  const isHttp = (v: string): RegExpMatchArray | null =>
    v.match(/^https?:\/\//);
  const imageUrlsInBody = getImageSrcsInHtml(algorithm.getBody()).filter(
    isHttp
  );
  const imageUrlsInOutcomes = algorithm
    .getOutcomes()
    .flatMap((o) => getImageSrcsInHtml(o.getBody()))
    .filter(isHttp);
  let imageUrls = imageUrlsInBody.concat(imageUrlsInOutcomes);

  const imageUrlVisitor = {
    visitTextAlgorithm(): void {},
    visitScoredAlgorithm(algo: ScoredAlgorithm): void {
      const imageUrlsInSwitchDescriptions = algo
        .getSwitches()
        .flatMap((s) => getImageSrcsInHtml(s.getDescription() ?? ''))
        .filter(isHttp);
      imageUrls = imageUrls.concat(imageUrlsInSwitchDescriptions);
    },
  } satisfies AlgorithmVisitor;
  algorithm.acceptVisitor(imageUrlVisitor);

  const promises = imageUrls.map((v) =>
    getCachedImage(v).then((image) => [v, image.getUri()] as const)
  );
  const imagesUrlsAndCacheResults = await Promise.all(promises);
  const uriMap = Object.fromEntries(imagesUrlsAndCacheResults);
  const newBody = replaceImageSrcsInHtml(uriMap, algorithm.getBody());
  const newOutcomes = algorithm.getOutcomes().map((o) =>
    o.clone({
      body: replaceImageSrcsInHtml(uriMap, o.getBody()),
    })
  );
  let newAlgorithm: Algorithm | undefined;
  const replaceUrlsVisitor = {
    visitTextAlgorithm(algo: TextAlgorithm): void {
      newAlgorithm = algo.setMetadata({
        body: newBody,
        outcomes: newOutcomes,
      });
    },
    visitScoredAlgorithm(algo: ScoredAlgorithm): void {
      const newSwitches = algo.getSwitches().map((s) =>
        s.clone({
          description:
            s.getDescription() &&
            replaceImageSrcsInHtml(uriMap, s.getDescription() ?? ''),
        })
      );
      newAlgorithm = algo
        .setMetadata({
          body: newBody,
          outcomes: newOutcomes,
        })
        .clone({ switches: newSwitches });
    },
  } satisfies AlgorithmVisitor;
  algorithm.acceptVisitor(replaceUrlsVisitor);
  if (!newAlgorithm)
    throw new Error('replaceUrlsVisitor has not visited the algorithm');
  return newAlgorithm;
}

export async function getAndAddCachedImagesForAlgorithms(
  getCachedImage: (uri: string) => Promise<Image>,
  getImageSrcsInHtml: GetImageSrcsInHtml,
  replaceImageSrcsInHtml: ReplaceImageSrcsInHtml,
  algorithms: Algorithm[]
): Promise<Algorithm[]> {
  const promises = algorithms.map((a) =>
    getAndAddCachedImagesForAlgorithm(
      getCachedImage,
      getImageSrcsInHtml,
      replaceImageSrcsInHtml,
      a
    )
  );
  return Promise.all(promises);
}
