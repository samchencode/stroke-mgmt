import type { Tag } from '@/domain/models/Tag/Tag';

interface TagRepository {
  getAll(): Promise<Tag[]>;
}

export type { TagRepository };
