import type { Image } from '@/domain/models/Image/Image';

interface ImageRepository {
  getAll(): Promise<Image[]>;
  getDeterministicImageForString(str: string): Promise<Image>;
}

export type { ImageRepository };
