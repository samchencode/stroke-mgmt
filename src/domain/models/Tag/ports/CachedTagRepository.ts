import type { Tag } from '@/domain/models/Tag/Tag';
import type { TagRepository } from '@/domain/models/Tag/ports/TagRepository';

interface CachedTagRepository extends TagRepository {
  saveAll(tags: Tag[]): Promise<void>;
  update(tag: Tag): Promise<void>;
  delete(tagName: string): Promise<void>;
  clearCache(): Promise<void>;
}

export type { CachedTagRepository };
