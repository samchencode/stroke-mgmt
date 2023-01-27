import type { Algorithm } from '@/domain/models/Algorithm';

class RenderedAlgorithm {
  constructor(private algorithm: Algorithm, private html: string) {}

  getAlgorithmId() {
    return this.algorithm.getId();
  }

  getAlgorithm() {
    return this.algorithm;
  }

  getHtml() {
    return this.html;
  }

  is(other: RenderedAlgorithm) {
    if (!other.getAlgorithmId().is(this.getAlgorithmId())) return false;
    return true;
  }
}

export { RenderedAlgorithm };
