import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { AlgorithmInfo } from '@/domain/models/Algorithm/AlgorithmInfo';
import type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { Image } from '@/domain/models/Image';

type TextAlgorithmParams = {
  info: AlgorithmInfo;
};

class TextAlgorithm implements Algorithm {
  private info: AlgorithmInfo;

  constructor({ info }: TextAlgorithmParams) {
    this.info = info;
  }

  getOutcomes(): Outcome[] {
    return this.info.getOutcomes();
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

  is(other: Algorithm): boolean {
    return other.getId().is(this.getId());
  }

  acceptVisitor(v: AlgorithmVisitor): void {
    v.visitTextAlgorithm(this);
  }
}

export { TextAlgorithm };
