import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { Image } from '@/domain/models/Image';

type AlgorithmParams = {
  id: AlgorithmId;
  title: string;
  body: string;
  thumbnail: Image;
  summary: string;
  outcomes: Outcome[];
};

class AlgorithmInfo {
  private id: AlgorithmId;

  private title: string;

  private body: string;

  private thumbnail: Image;

  private summary: string;

  private outcomes: Outcome[];

  constructor({
    id,
    title,
    body,
    outcomes,
    summary,
    thumbnail,
  }: AlgorithmParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.thumbnail = thumbnail;
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

  getThumbnail() {
    return this.thumbnail;
  }

  getOutcomes() {
    return this.outcomes;
  }

  getSummary() {
    return this.summary;
  }
}

export { AlgorithmInfo };
