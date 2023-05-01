import type { CachedImageMetadataRepository } from '@/domain/models/Image/ports/CachedImageMetadataRepository';
import type { ImageStore } from '@/domain/models/Image/ports/ImageStore';

class ImageCache {
  constructor(
    private readonly imageStore: ImageStore,
    private readonly cachedImageMetadataRepository: CachedImageMetadataRepository
  ) {}

  async saveImage(url: string) {
    const metadata = await this.imageStore.saveFileFromUrl(url);
    return this.cachedImageMetadataRepository.save(metadata);
  }

  async getCachedImageAsBase64Url(url: string): Promise<string | null> {
    const metadata = await this.cachedImageMetadataRepository.get(url);
    if (!metadata) return null;
    const fileExists = await this.imageStore.fileExists(metadata.getFilePath());
    if (!fileExists) return null;
    return this.imageStore.getFileAsBase64Url(metadata);
  }

  async getCachedImageAsFileUri(url: string): Promise<string | null> {
    const metadata = await this.cachedImageMetadataRepository.get(url);
    if (!metadata) return null;
    const fileExists = await this.imageStore.fileExists(metadata.getFilePath());
    if (!fileExists) return null;
    return metadata.getFilePath();
  }

  async clearCache() {
    return Promise.all([
      this.imageStore.deleteAll(),
      this.cachedImageMetadataRepository.clearCache(),
    ]);
  }
}

export { ImageCache };
