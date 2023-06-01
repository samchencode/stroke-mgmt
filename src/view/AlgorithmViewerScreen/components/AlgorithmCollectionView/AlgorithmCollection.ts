import type { AlgorithmId } from '@/domain/models/Algorithm';

type AlgorithmIdWithUuid = {
  id: AlgorithmId;
  uuid: string;
};

class AlgorithmCollection {
  private constructor(private ids: AlgorithmIdWithUuid[]) {}

  getIds(): AlgorithmIdWithUuid[] {
    return this.ids;
  }

  getUuids(): string[] {
    return this.ids.map((v) => v.uuid);
  }

  append(uuid: string, newId: AlgorithmId, newUuid: string) {
    const newLastIdx = this.ids.findIndex((v) => v.uuid === uuid);
    if (newLastIdx === -1) return this;
    const newIds = this.ids.slice(0, newLastIdx + 1);
    newIds.push({ id: newId, uuid: newUuid });
    return new AlgorithmCollection(newIds);
  }

  drop(uuid: string) {
    const newLastIdx = this.ids.findIndex((v) => v.uuid === uuid);
    if (newLastIdx === -1) return this;
    const newIds = this.ids.slice(0, newLastIdx + 1);
    return new AlgorithmCollection(newIds);
  }

  static fromInitial(initialId: AlgorithmId, uuid: string) {
    return new AlgorithmCollection([{ id: initialId, uuid }]);
  }

  get length() {
    return this.ids.length;
  }
}

export { AlgorithmCollection };
export type { AlgorithmIdWithUuid };
