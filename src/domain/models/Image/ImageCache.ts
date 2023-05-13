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

  // added specifically because expo cached article repo needs to get base64 images.
  // if this dependency is entrenched deeper, it'd be useful to make a separate class for it.
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

  async saveImageIfNotExists(url: string): Promise<void> {
    let metadata = await this.cachedImageMetadataRepository.get(url);
    if (!metadata) {
      metadata = await this.imageStore.saveFileFromUrl(url);
    }
    const fileExists = await this.imageStore.fileExists(metadata.getFilePath());
    if (!fileExists) {
      await this.cachedImageMetadataRepository.save(metadata);
    }
  }
}

export { ImageCache };
