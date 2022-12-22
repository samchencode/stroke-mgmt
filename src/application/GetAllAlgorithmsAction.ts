import type { AlgorithmRepository } from '@/domain/models/Algorithm';

class GetAllAlgorithmsAction {
  repo: AlgorithmRepository;

  constructor(algorithmRepository: AlgorithmRepository) {
    this.repo = algorithmRepository;
  }

  async execute() {
    return this.repo.getAll();
  }
}

export { GetAllAlgorithmsAction };
