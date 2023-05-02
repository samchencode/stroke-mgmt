import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { AlgorithmMetadata } from '@/domain/models/Algorithm/AlgorithmMetadata';

interface AlgorithmRepository {
  getAll(): Promise<Algorithm[]>;
  getById(id: AlgorithmId): Promise<Algorithm>;
  getAllShownOnHomeScreen(): Promise<Algorithm[]>;
  getAllMetadata(): Promise<AlgorithmMetadata[]>;
  getMetadataById(id: AlgorithmId): Promise<AlgorithmMetadata>;
  getMetadataForAllShownOnHomeScreen(): Promise<AlgorithmMetadata[]>;
  isAvailable(): Promise<boolean>;
}

export type { AlgorithmRepository };
