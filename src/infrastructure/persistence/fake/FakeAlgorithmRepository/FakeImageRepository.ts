import { Image } from '@/domain/models/Image';
import type { ImageRepository } from '@/domain/models/Image';

class FakeImageRepository implements ImageRepository {
  async getAll(): Promise<Image[]> {
    throw new Error('Method not implemented.');
  }

  async getDeterministicImageForString(str: string): Promise<Image> {
    return new Image(`/${str}.png`);
  }
}

export { FakeImageRepository };
