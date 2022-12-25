import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';

type AlgorithmParams = {
  id: AlgorithmId;
  title: string;
  body: string;
  summary: string;
  outcomes: Outcome[];
};

class AlgorithmInfo {
  private id: AlgorithmId;

  private title: string;

  private body: string;

  private summary: string;

  private outcomes: Outcome[];

  constructor({ id, title, body, outcomes, summary }: AlgorithmParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.outcomes = outcomes;
    this.summary = summary;
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

  getSummary() {
    return this.summary;
  }
}

export { AlgorithmInfo };
