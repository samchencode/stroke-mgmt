import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';

interface AlgorithmRepository {
  getAll(): Promise<Algorithm[]>;
}

export type { AlgorithmRepository };
