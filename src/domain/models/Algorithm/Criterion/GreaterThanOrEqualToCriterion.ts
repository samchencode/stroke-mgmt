import type { BaseCriterion } from '@/domain/models/Algorithm/Criterion/Criterion';

class GreaterThanOrEqualToCriterion implements BaseCriterion {
  readonly type = 'GreaterThanOrEqualToCriterion';

  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  check(v: number): boolean {
    return v >= this.threshold;
  }

  getThreshold() {
    return this.threshold;
  }

  is(other: BaseCriterion): boolean {
    if (!(other instanceof GreaterThanOrEqualToCriterion)) return false;
    if (other.getThreshold() !== this.threshold) return false;
    return true;
  }
}

export { GreaterThanOrEqualToCriterion };
