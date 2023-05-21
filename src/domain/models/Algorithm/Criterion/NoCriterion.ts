import type { BaseCriterion } from '@/domain/models/Algorithm/Criterion/Criterion';

class NoCriterion implements BaseCriterion {
  readonly type = 'NoCriterion';

  check() {
    return true;
  }

  is(v: BaseCriterion) {
    if (v instanceof NoCriterion) return true;
    return false;
  }
}

export { NoCriterion };
