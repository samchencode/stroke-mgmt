import { Tag } from '@/domain/models/Tag';
import type { TagRepository } from '@/domain/models/Tag';

class FakeTagRepository implements TagRepository {
  async getAll(): Promise<Tag[]> {
    return [
      new Tag('My Tag 1', 'Some information about this tag.'),
      new Tag('My Tag 2', 'Some other information about this tag.'),
      new Tag('My Tag 3'),
    ];
  }
}

export { FakeTagRepository };
