import type { BaseAlgorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type {
  AlgorithmInfo,
  AlgorithmParams,
} from '@/domain/models/Algorithm/AlgorithmInfo';
import type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { Citation } from '@/domain/models/Citation';
import type { Image } from '@/domain/models/Image';

type TextAlgorithmParams = {
  info: AlgorithmInfo;
};

class TextAlgorithm implements BaseAlgorithm {
  private info: AlgorithmInfo;

  readonly type = 'TextAlgorithm';

  constructor({ info }: TextAlgorithmParams) {
    this.info = info;
  }

  getOutcomes(): Outcome[] {
    return this.info.getOutcomes();
  }

  getDisplayedOutcomes(): Outcome[] {
    return this.getOutcomes();
  }

  hasOutcomes(): boolean {
    const outcomes = this.info.getOutcomes();
    return outcomes.length > 0;
  }

  getId(): AlgorithmId {
    return this.info.getId();
  }

  getTitle(): string {
    return this.info.getTitle();
  }

  getBody(): string {
    return this.info.getBody();
  }

  getThumbnail(): Image {
    return this.info.getThumbnail();
  }

  getSummary(): string {
    return this.info.getSummary();
  }

  getCitations(): Citation[] {
    return this.info.getCitations();
  }

  getShouldShowOnHomeScreen(): boolean {
    return this.info.getShouldShowOnHomeScreen();
  }

  getLastUpdated(): Date {
    return this.info.getLastUpdated();
  }

  is(other: BaseAlgorithm): boolean {
    return other.getId().is(this.getId());
  }

  setMetadata(info: Partial<AlgorithmParams>): TextAlgorithm {
    const newInfo = this.info.clone(info);
    return new TextAlgorithm({ info: newInfo });
  }

  acceptVisitor(v: AlgorithmVisitor): void {
    v.visitTextAlgorithm(this);
  }
}

export { TextAlgorithm };
