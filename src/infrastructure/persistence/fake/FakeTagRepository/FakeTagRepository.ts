import { Tag } from '@/domain/models/Tag';
import type { TagRepository } from '@/domain/models/Tag';

class FakeTagRepository implements TagRepository {
  async getAll(): Promise<Tag[]> {
    return [
      new Tag('My Tag 1', new Date(0), 'Some information about this tag.'),
      new Tag(
        'My Tag 2',
        new Date(0),
        'Some other information about this tag.'
      ),
      new Tag('My Tag 3', new Date(0)),
      new Tag('My Tag 4', new Date(0)),
      new Tag('A veryyyyy longggg tagggg', new Date(0)),
    ];
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

export { FakeTagRepository };
