import type { IntroSequence } from '@/domain/models/IntroSequence';
import type { IntroSequenceCache } from '@/domain/services/Cache';

class GetIntroSequenceAction {
  constructor(private readonly introSequenceCache: IntroSequenceCache) {}

  async execute(onStale: (v: IntroSequence) => void) {
    return this.introSequenceCache.get(onStale);
  }
}

export { GetIntroSequenceAction };
