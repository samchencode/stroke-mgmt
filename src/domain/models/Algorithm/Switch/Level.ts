import type { LevelId } from '@/domain/models/Algorithm/Switch/LevelId';

class Level {
  constructor(
    private id: LevelId,
    private label: string,
    private value: number
  ) {}

  getId() {
    return this.id;
  }

  getLabel() {
    return this.label;
  }

  getValue() {
    return this.value;
  }

  is(other: Level) {
    return this.getId() === other.getId();
  }
}

export { Level };
