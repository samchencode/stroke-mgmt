class IntroSequenceInvalidError extends Error {
  name = 'IntroSequenceInvalidError';

  constructor(articleIds: unknown, algoId: unknown, suggestAfterId: unknown) {
    super();
    this.message = `Invalid intro sequence: ${this.introSequenceToString(
      articleIds,
      algoId,
      suggestAfterId
    )}`;
  }

  introSequenceToString(
    articleIds: unknown,
    algoId: unknown,
    sugAfterId: unknown
  ) {
    const articleIdsString =
      articleIds instanceof Array
        ? `articleIds=[${articleIds.map((x) => String(x)).join(',')}]`
        : `articleIds=${String(articleIds)}`;
    const algoIdString = `suggestedAlgorithmId=${String(algoId)}`;
    const sugAfterIdString = `suggestAlgorithmAfterArticleId=${String(
      sugAfterId
    )}`;

    return [articleIdsString, algoIdString, sugAfterIdString].join(',');
  }
}

export { IntroSequenceInvalidError };
