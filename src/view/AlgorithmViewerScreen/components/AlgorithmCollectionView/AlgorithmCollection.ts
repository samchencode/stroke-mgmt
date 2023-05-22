import type { AlgorithmId } from '@/domain/models/Algorithm';

class AlgorithmCollection {
  private ids: AlgorithmId[];

  private constructor(ids: AlgorithmId[]) {
    this.ids = ids;
  }

  getIds() {
    return this.ids;
  }

  append(after: AlgorithmId, newId: AlgorithmId) {
    const newLastIdx = this.ids.findIndex((a) => a.is(after));
    const newIds = this.ids.slice(0, newLastIdx + 1);
    newIds.push(newId);
    return new AlgorithmCollection(newIds);
  }

  static fromInitial(initialId: AlgorithmId) {
    return new AlgorithmCollection([initialId]);
  }
}

export { AlgorithmCollection };
