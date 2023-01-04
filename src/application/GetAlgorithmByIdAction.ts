import type {
  AlgorithmId,
  AlgorithmRepository,
} from '@/domain/models/Algorithm';

class GetAlgorithmByIdAction {
  private repo: AlgorithmRepository;

  constructor(algorithmRepository: AlgorithmRepository) {
    this.repo = algorithmRepository;
  }

  async execute(id: AlgorithmId) {
    return this.repo.getById(id);
  }
}

export { GetAlgorithmByIdAction };
