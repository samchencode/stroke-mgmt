import type {
  Algorithm,
  AlgorithmId,
  AlgorithmRepository,
} from '@/domain/models/Algorithm';
import { AlgorithmMetadata } from '@/domain/models/Algorithm/AlgorithmMetadata';
import { algorithms } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository/fakeAlgorithms';

class FakeAlgorithmRepository implements AlgorithmRepository {
  async getAllMetadata(): Promise<AlgorithmMetadata[]> {
    const result = await this.getAll();
    return result.map(
      (a) => new AlgorithmMetadata(a.getId(), a.getLastUpdated())
    );
  }

  async getMetadataById(id: AlgorithmId): Promise<AlgorithmMetadata> {
    const result = await this.getById(id);
    return new AlgorithmMetadata(result.getId(), result.getLastUpdated());
  }

  async getMetadataForAllShownOnHomeScreen(): Promise<AlgorithmMetadata[]> {
    const result = await this.getAllShownOnHomeScreen();
    return result.map(
      (a) => new AlgorithmMetadata(a.getId(), a.getLastUpdated())
    );
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

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
