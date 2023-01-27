import type { RenderedAlgorithm } from '@/domain/models/Algorithm/RenderedAlgorithm';
import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';

class RenderedAlgorithmCollection {
  private algos: RenderedAlgorithm[];

  constructor(algos: RenderedAlgorithm[]);
  constructor(firstAlgorithm: RenderedAlgorithm);
  constructor(param: RenderedAlgorithm | RenderedAlgorithm[]) {
    if (param instanceof Array) {
      if (param.length === 0)
        throw Error(
          'RenderedAlgorithmCollection must have at least one algorithm'
        );
      this.algos = param;
    } else this.algos = [param];
  }

  get() {
    return this.algos;
  }

  /**
   * Replaces the algo of the same id within the collection with
   * with the algo provided
   *
   * @param algo an updated version of a RenderedAlgorithm that already exists in this collection
   * @returns a clone of this collection with the change applied
   */
  setAlgorithm(algo: RenderedAlgorithm) {
    const idx = this.algos.findIndex((a) => a.is(algo));
    const newAlgos = this.algos.slice(0, idx);
    newAlgos.push(algo);
    return this.clone(newAlgos);
  }

  /**
   * Add a new algorithm to the collection right after
   * the algorithm whose outcome that triggered the
   * insertion. Delete any algorithms after it.
   *
   * @param algo RenderedAlgorithm to be added
   * @param source Algorithm whose outcome led to this algo
   * @returns a clone of this collection with the change applied
   */
  selectAlgorithm(algo: RenderedAlgorithm, source: Algorithm) {
    const srcIdx = this.algos.findIndex((a) =>
      a.getAlgorithmId().is(source.getId())
    );
    const newAlgos = this.algos.slice(0, srcIdx + 1);
    newAlgos.push(algo);
    return this.clone(newAlgos);
  }

  clone(algos: RenderedAlgorithm[]) {
    return new RenderedAlgorithmCollection(algos);
  }

  get length() {
    return this.algos.length;
  }
}

export { RenderedAlgorithmCollection };
