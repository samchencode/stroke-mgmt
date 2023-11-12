import type { Algorithm, AlgorithmRenderer } from '@/domain/models/Algorithm';
import { RenderedAlgorithm } from '@/domain/models/Algorithm';

class RenderAlgorithmAction {
  constructor(private algorithmRenderer: AlgorithmRenderer) {}

  static $inject = ['algorithmRenderer'];

  async execute(algorithm: Algorithm) {
    const html = await this.algorithmRenderer.renderAlgorithm(algorithm);
    return new RenderedAlgorithm(algorithm, html);
  }
}

export { RenderAlgorithmAction };
