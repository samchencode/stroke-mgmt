import type { Criterion } from '@/domain/models/Algorithm/Criterion';
import { NoCriterion } from '@/domain/models/Algorithm/Criterion';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';

type OutcomeParams = {
  title: string;
  body: string;
  criterion?: Criterion;
  next?: AlgorithmId;
};

class Outcome {
  private title: string;

  private body: string;

  private criterion: Criterion;

  private next: AlgorithmId | null;

  constructor({ title, body, criterion, next }: OutcomeParams) {
    this.title = title;
    this.body = body;
    this.criterion = criterion ?? new NoCriterion();
    this.next = next ?? null;
  }

  getTitle() {
    return this.title;
  }

  getBody() {
    return this.body;
  }

  getCriterion() {
    return this.criterion;
  }

  getNext() {
    return this.next;
  }

  checkCriterion(v: number) {
    return this.criterion.check(v);
  }

  clone(params: Partial<OutcomeParams>): Outcome {
    return new Outcome({
      title: this.getTitle(),
      body: this.getBody(),
      criterion: this.getCriterion(),
      next: this.getNext() ?? undefined,
      ...params,
    });
  }

  is(other: Outcome) {
    if (other.getBody() !== this.body) return false;
    if (other.getTitle() !== this.title) return false;
    if (!other.getCriterion().is(this.criterion)) return false;
    return true;
  }
}

export { Outcome };
