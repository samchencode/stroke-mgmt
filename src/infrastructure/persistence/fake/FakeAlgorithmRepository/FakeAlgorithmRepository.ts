import type { Algorithm, AlgorithmRepository } from '@/domain/models/Algorithm';
import { gwnsAlgorithm } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository/fakeAlgorithms';

class FakeAlgorithmRepository implements AlgorithmRepository {
  async getAll(): Promise<Algorithm[]> {
    return [gwnsAlgorithm];
  }
}

export { FakeAlgorithmRepository };
