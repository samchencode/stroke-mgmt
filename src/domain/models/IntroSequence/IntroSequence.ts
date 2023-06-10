import type { AlgorithmId } from '@/domain/models/Algorithm';
import type { ArticleId } from '@/domain/models/Article';
import { IntroSequenceInvalidError } from '@/domain/models/IntroSequence/IntroSequenceInvalidError';

class IntroSequence {
  constructor(
    private articleIds: ArticleId[],
    private suggestedAlgorithmId: AlgorithmId,
    private suggestAlgorithmAfterArticleId: ArticleId,
    private lastUpdated: Date
  ) {
    if (!this.validate())
      throw new IntroSequenceInvalidError(
        articleIds,
        suggestedAlgorithmId,
        suggestAlgorithmAfterArticleId
      );
  }

  private validate() {
    if (this.articleIds.length === 0) return false;
    const afterArticleIdNotIncluded = !this.articleIds.find((id) =>
      id.is(this.suggestAlgorithmAfterArticleId)
    );
    if (afterArticleIdNotIncluded) return false;
    return true;
  }

  getArticleIds() {
    return this.articleIds;
  }

  getSuggestedAlgorithmId() {
    return this.suggestedAlgorithmId;
  }

  getSuggestAlgorithmAfterArticleId() {
    return this.suggestAlgorithmAfterArticleId;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }
}

export { IntroSequence };
