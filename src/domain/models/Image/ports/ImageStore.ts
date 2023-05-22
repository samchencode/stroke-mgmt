import type { CachedImageMetadata } from '@/domain/models/Image/CachedImageMetadata';

interface ImageStore {
  getFileAsBase64Url(metadata: CachedImageMetadata): Promise<string>;
  saveFileFromUrl(url: string): Promise<CachedImageMetadata>;
  fileExists(path: string): Promise<boolean>;
  deleteAll(): Promise<void>;
}

export type { ImageStore };
