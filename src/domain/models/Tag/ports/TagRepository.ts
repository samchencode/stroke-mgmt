import type { Tag } from '@/domain/models/Tag/Tag';

interface TagRepository {
  getAll(): Promise<Tag[]>;
  isAvailable(): Promise<boolean>;
}

export type { TagRepository };
