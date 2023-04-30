import type {
  Algorithm,
  AlgorithmId,
  AlgorithmRepository,
} from '@/domain/models/Algorithm';
import { algorithms } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository/fakeAlgorithms';

class FakeAlgorithmRepository implements AlgorithmRepository {
  async getAll(): Promise<Algorithm[]> {
    return algorithms;
  }

  async getAllShownOnHomeScreen(): Promise<Algorithm[]> {
    return algorithms;
  }

  async getById(id: AlgorithmId): Promise<Algorithm> {
    const result = algorithms.find((a) => a.getId().is(id));
    if (!result) throw Error('Algorithm not found!');
    return result;
  }
}

export { FakeAlgorithmRepository };
