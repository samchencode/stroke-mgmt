import type ejs from 'ejs';
import type { Algorithm, AlgorithmVisitor } from '@/domain/models/Algorithm';

class EjsAlgorithmVisitor implements AlgorithmVisitor {
  private template: ejs.ClientFunction | null = null;

  private algorithm: Algorithm | null = null;

  constructor(
    private textAlgorithmTemplate: ejs.ClientFunction,
    private scoredAlgorithmTemplate: ejs.ClientFunction
  ) {}

  visit(algo: Algorithm) {
    this.algorithm = algo;
    algo.acceptVisitor(this);
  }

  visitTextAlgorithm(): void {
    this.template = this.textAlgorithmTemplate;
  }

  visitScoredAlgorithm(): void {
    this.template = this.scoredAlgorithmTemplate;
  }

  render(...args: Parameters<ejs.ClientFunction>) {
    if (this.algorithm === null || this.template === null)
      throw Error('Render was called before visitor was accepted.');
    return this.template(...args);
  }
}

export { EjsAlgorithmVisitor };
