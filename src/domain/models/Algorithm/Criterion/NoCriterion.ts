import type { Criterion } from '@/domain/models/Algorithm/Criterion/Criterion';

class NoCriterion implements Criterion {
  check() {
    return true;
  }

  is(v: Criterion) {
    if (v instanceof NoCriterion) return true;
    return false;
  }
}

export { NoCriterion };
