class CachedIntroSequenceNotFoundError extends Error {
  name = 'CachedIntroSequenceNotFoundError';

  message = 'No Intro Sequence set in cache';
}

export { CachedIntroSequenceNotFoundError };
