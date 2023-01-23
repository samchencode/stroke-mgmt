class WebViewError extends Error {
  name = 'WebViewError';

  constructor(name: string, message: string) {
    super(`Error inside WebView:\n${name}: ${message}`);
  }
}

export { WebViewError };
