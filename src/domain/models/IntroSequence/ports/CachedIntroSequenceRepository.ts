import type { IntroSequence } from '@/domain/models/IntroSequence/IntroSequence';
import type { IntroSequenceRepository } from '@/domain/models/IntroSequence/ports/IntroSequenceRepository';

interface CachedIntroSequenceRepository extends IntroSequenceRepository {
  save(v: IntroSequence): Promise<void>;
  update(v: IntroSequence): Promise<void>;
  clearCache(): Promise<void>;
}

export type { CachedIntroSequenceRepository };
