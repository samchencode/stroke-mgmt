import type {
  CachedIntroSequenceRepository,
  IntroSequence,
} from '@/domain/models/IntroSequence';
import type { Getter } from '@/domain/services/Cache/Getter';

async function handleCacheStale(
  cachedIntroSequenceRepository: CachedIntroSequenceRepository,
  sourceGet: Getter<IntroSequence>,
  cachedIntroSequence: IntroSequence,
  onStale: (v: IntroSequence) => void
) {
  const sourceIntroSequence = await sourceGet();
  const isStale =
    sourceIntroSequence.getLastUpdated() > cachedIntroSequence.getLastUpdated();
  if (!isStale) return;
  onStale(sourceIntroSequence);
  cachedIntroSequenceRepository.save(sourceIntroSequence);
}

export { handleCacheStale };
