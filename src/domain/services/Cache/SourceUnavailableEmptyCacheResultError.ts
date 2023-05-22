const message =
  'We could not reach the server, and there was no saved version of the requested resource(s). If you were expecting to find something, please check your network connection and try again.';

class SourceUnavailableEmptyCacheResultError extends Error {
  name = 'EmptyCacheResultError';

  constructor() {
    super(message);
  }
}

export { SourceUnavailableEmptyCacheResultError };
