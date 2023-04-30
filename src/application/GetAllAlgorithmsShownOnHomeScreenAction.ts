import type { AlgorithmRepository } from '@/domain/models/Algorithm';

class GetAllAlgorithmsShownOnHomeScreenAction {
  repo: AlgorithmRepository;

  constructor(algorithmRepository: AlgorithmRepository) {
    this.repo = algorithmRepository;
  }

  async execute() {
    return this.repo.getAllShownOnHomeScreen();
  }
}

export { GetAllAlgorithmsShownOnHomeScreenAction };
