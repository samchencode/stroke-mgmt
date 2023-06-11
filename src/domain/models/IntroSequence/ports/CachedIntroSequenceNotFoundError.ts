class CachedIntroSequenceNotFoundError extends Error {
  name = 'CachedIntroSequenceNotFoundError';

  constructor() {
    const message = 'No Intro Sequence set in cache';
    super(message);
  }
}

export { CachedIntroSequenceNotFoundError };
