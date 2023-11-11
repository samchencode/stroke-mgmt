import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { Citation } from '@/domain/models/Citation';
import type { Image } from '@/domain/models/Image';

type AlgorithmParams = {
  id: AlgorithmId;
  title: string;
  body: string;
  thumbnail: Image;
  summary: string;
  outcomes: Outcome[];
  citations: Citation[];
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

  private citations: Citation[];

  constructor({
    id,
    title,
    body,
    outcomes,
    summary,
    thumbnail,
    shouldShowOnHomeScreen,
    lastUpdated,
    citations,
  }: AlgorithmParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.thumbnail = thumbnail;
    this.outcomes = outcomes;
    this.summary = summary;
    this.shouldShowOnHomeScreen = shouldShowOnHomeScreen;
    this.lastUpdated = lastUpdated;
    this.citations = citations;
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

  getCitations() {
    return this.citations;
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
      citations: this.getCitations(),
      shouldShowOnHomeScreen: this.getShouldShowOnHomeScreen(),
      lastUpdated: this.getLastUpdated(),
      ...params,
    });
  }
}

export { AlgorithmInfo };
export type { AlgorithmParams };
