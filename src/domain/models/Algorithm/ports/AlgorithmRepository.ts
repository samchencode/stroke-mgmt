import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';

interface AlgorithmRepository {
  getAll(): Promise<Algorithm[]>;
  getById(id: AlgorithmId): Promise<Algorithm>;
  getAllShownOnHomeScreen(): Promise<Algorithm[]>;
  isAvailable(): Promise<boolean>;
}

export type { AlgorithmRepository };
