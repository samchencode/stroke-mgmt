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
};

class AlgorithmInfo {
  private id: AlgorithmId;

  private title: string;

  private body: string;

  private thumbnail: Image;

  private summary: string;

  private outcomes: Outcome[];

  private shouldShowOnHomeScreen: boolean;

  constructor({
    id,
    title,
    body,
    outcomes,
    summary,
    thumbnail,
    shouldShowOnHomeScreen,
  }: AlgorithmParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.thumbnail = thumbnail;
    this.outcomes = outcomes;
    this.summary = summary;
    this.shouldShowOnHomeScreen = shouldShowOnHomeScreen;
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

  getshouldShowOnHomeScreen() {
    return this.shouldShowOnHomeScreen;
  }
}

export { AlgorithmInfo };
