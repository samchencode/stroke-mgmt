import type { Criterion } from '@/domain/models/Algorithm/Criterion/Criterion';

class LessThanCriterion implements Criterion {
  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  check(v: number): boolean {
    return v < this.threshold;
  }

  getThreshold() {
    return this.threshold;
  }

  is(other: Criterion): boolean {
    if (!(other instanceof LessThanCriterion)) return false;
    if (other.getThreshold() !== this.threshold) return false;
    return true;
  }
}

export { LessThanCriterion };
