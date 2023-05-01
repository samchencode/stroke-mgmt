import type { CachedImageMetadata } from '@/domain/models/Image/CachedImageMetadata';

interface CachedImageMetadataRepository {
  get(url: string): Promise<CachedImageMetadata | null>;
  save(metadata: CachedImageMetadata): Promise<void>;
  clearCache(): Promise<void>;
}

export type { CachedImageMetadataRepository };
