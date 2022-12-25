import type { Algorithm, AlgorithmRenderer } from '@/domain/models/Algorithm';

class RenderAlgorithmAction {
  constructor(private algorithmRenderer: AlgorithmRenderer) {}

  async execute(algorithm: Algorithm) {
    return this.algorithmRenderer.renderAlgorithm(algorithm);
  }
}

export { RenderAlgorithmAction };
