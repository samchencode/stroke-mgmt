class CachedImageMetadata {
  constructor(
    private sourceUrl: string,
    private filePath: string,
    private mimeType: string
  ) {}

  getSourceUrl() {
    return this.sourceUrl;
  }

  getFilePath() {
    return this.filePath;
  }

  getMimeType() {
    return this.mimeType;
  }
}

export { CachedImageMetadata };
