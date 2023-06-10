import type { IntroSequence } from '@/domain/models/IntroSequence/IntroSequence';

interface IntroSequenceRepository {
  get(): Promise<IntroSequence>;
  isAvailable(): Promise<boolean>;
}

export type { IntroSequenceRepository };
