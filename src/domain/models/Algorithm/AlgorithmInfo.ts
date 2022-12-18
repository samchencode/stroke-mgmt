import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';

type AlgorithmParams = {
  id: AlgorithmId;
  title: string;
  body: string;
  outcomes: Outcome[];
};

class AlgorithmInfo {
  private id: AlgorithmId;

  private title: string;

  private body: string;

  private outcomes: Outcome[];

  constructor({ id, title, body, outcomes }: AlgorithmParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.outcomes = outcomes;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getBody() {
    return this.body;
  }

  getOutcomes() {
    return this.outcomes;
  }
}

export { AlgorithmInfo };
