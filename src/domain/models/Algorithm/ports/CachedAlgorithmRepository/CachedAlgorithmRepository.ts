import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { AlgorithmRepository } from '@/domain/models/Algorithm/ports/AlgorithmRepository/AlgorithmRepository';

interface CachedAlgorithmRepository extends AlgorithmRepository {
  isEmpty(): Promise<boolean>;
  saveAll(a: Algorithm[]): Promise<void>;
  update(a: Algorithm): Promise<void>;
  delete(a: AlgorithmId): Promise<void>;
  clearCache(): Promise<void>;
}

export type { CachedAlgorithmRepository };
