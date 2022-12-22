import type ejs from 'ejs';
import type {
  Algorithm,
  AlgorithmVisitor,
  ScoredAlgorithm,
  TextAlgorithm,
} from '@/domain/models/Algorithm';

class EjsAlgorithmVisitor implements AlgorithmVisitor {
  private renderedHtml: string | null = null;

  constructor(
    private textAlgorithmTemplate: ejs.TemplateFunction,
    private scoredAlgorithmTemplate: ejs.TemplateFunction
  ) {}

  visit(algo: Algorithm) {
    algo.acceptVisitor(this);
  }

  visitTextAlgorithm(algorithm: TextAlgorithm): void {
    this.renderedHtml = this.textAlgorithmTemplate({ algorithm });
  }

  visitScoredAlgorithm(algorithm: ScoredAlgorithm): void {
    this.renderedHtml = this.scoredAlgorithmTemplate({ algorithm });
  }

  getRenderedHtml() {
    if (this.renderedHtml === null)
      throw Error('Rendered html requested before visitor was accepted.');
    return this.renderedHtml;
  }
}

export { EjsAlgorithmVisitor };
