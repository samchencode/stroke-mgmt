import type { BaseCriterion } from '@/domain/models/Algorithm/Criterion/Criterion';

class GreaterThanCriterion implements BaseCriterion {
  readonly type = 'GreaterThanCriterion';

  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  check(v: number): boolean {
    return v > this.threshold;
  }

  getThreshold() {
    return this.threshold;
  }

  is(other: BaseCriterion): boolean {
    if (!(other instanceof GreaterThanCriterion)) return false;
    if (other.getThreshold() !== this.threshold) return false;
    return true;
  }
}

export { GreaterThanCriterion };
