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
  shouldShowOnHomeScreen: boolean;
  lastUpdated: Date;
};

class AlgorithmInfo {
  private id: AlgorithmId;

  private title: string;

  private body: string;

  private thumbnail: Image;

  private summary: string;

  private outcomes: Outcome[];

  private shouldShowOnHomeScreen: boolean;

  private lastUpdated: Date;

  constructor({
    id,
    title,
    body,
    outcomes,
    summary,
    thumbnail,
    shouldShowOnHomeScreen,
    lastUpdated,
  }: AlgorithmParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.thumbnail = thumbnail;
    this.outcomes = outcomes;
    this.summary = summary;
    this.shouldShowOnHomeScreen = shouldShowOnHomeScreen;
    this.lastUpdated = lastUpdated;
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

  getShouldShowOnHomeScreen() {
    return this.shouldShowOnHomeScreen;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  clone(params: Partial<AlgorithmParams>) {
    return new AlgorithmInfo({
      id: this.getId(),
      title: this.getTitle(),
      body: this.getBody(),
      thumbnail: this.getThumbnail(),
      summary: this.getSummary(),
      outcomes: this.getOutcomes(),
      shouldShowOnHomeScreen: this.getShouldShowOnHomeScreen(),
      lastUpdated: this.getLastUpdated(),
      ...params,
    });
  }
}

export { AlgorithmInfo };
export type { AlgorithmParams };
