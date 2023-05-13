class SourceUnavailableCacheEmptyError extends Error {
  name = 'SourceUnavailableCacheEmptyError';

  constructor() {
    super(
      'Retrieving from empty cache while data source is unavailable. Hint: Are you connected to the internet?'
    );
  }
}

export { SourceUnavailableCacheEmptyError };
