import { AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleId } from '@/domain/models/Article';
import { IntroSequence } from '@/domain/models/IntroSequence';

type SerializedIntroSequence = {
  articleIds: string[];
  suggestedAlgorithmId: string;
  suggestAlgorithmAfterArticleId: string;
  lastUpdatedTimestamp: number;
};

export function serializeIntroSequence(introSequence: IntroSequence): string {
  const articleIds = introSequence.getArticleIds().map((id) => id.toString());
  const suggestedAlgorithmId = introSequence
    .getSuggestedAlgorithmId()
    .toString();
  const suggestAlgorithmAfterArticleId = introSequence
    .getSuggestAlgorithmAfterArticleId()
    .toString();
  const lastUpdatedTimestamp = introSequence.getLastUpdated().getTime();
  const dataObject = {
    articleIds,
    suggestedAlgorithmId,
    suggestAlgorithmAfterArticleId,
    lastUpdatedTimestamp,
  } satisfies SerializedIntroSequence;
  return JSON.stringify(dataObject);
}

export function deserializeIntroSequence(json: string) {
  const dataObject = JSON.parse(json) as SerializedIntroSequence;
  return new IntroSequence(
    dataObject.articleIds.map((id) => new ArticleId(id)),
    new AlgorithmId(dataObject.suggestedAlgorithmId),
    new ArticleId(dataObject.suggestAlgorithmAfterArticleId),
    new Date(dataObject.lastUpdatedTimestamp)
  );
}
