import type { Level } from '@/domain/models/Algorithm/Switch/Level';
import type { LevelId } from '@/domain/models/Algorithm/Switch/LevelId';
import { NullLevelId } from '@/domain/models/Algorithm/Switch/NullLevelId';
import type { SwitchId } from '@/domain/models/Algorithm/Switch/SwitchId';

type SwitchParams = {
  id: SwitchId;
  label: string;
  levels: Level[];
  activeLevel?: LevelId;
  set?: boolean;
  description?: string;
};

class Switch {
  private id: SwitchId;

  private label: string;

  private levels: Level[];

  private activeLevelId: LevelId;

  private set: boolean;

  private description?: string;

  constructor({
    id,
    label,
    levels,
    set = false,
    activeLevel = new NullLevelId(),
    description,
  }: SwitchParams) {
    this.id = id;
    this.label = label;
    this.levels = levels;
    this.activeLevelId = activeLevel;
    this.set = set;
    this.description = description;
  }

  setSwitchTo(levelId: LevelId) {
    return this.clone({
      set: true,
      activeLevel: levelId,
    });
  }

  getId(): SwitchId {
    return this.id;
  }

  getLabel(): string {
    return this.label;
  }

  getValue(): number {
    const activeLevel = this.levels.find((l) =>
      l.getId().is(this.activeLevelId)
    );
    if (!activeLevel) return 0;
    return activeLevel.getValue();
  }

  getActiveLevelId(): LevelId {
    return this.activeLevelId;
  }

  getDescription() {
    return this.description;
  }

  getLevels(): Level[] {
    return this.levels;
  }

  isSet(): boolean {
    return this.set;
  }

  is(other: Switch): boolean {
    return other.getId().is(this.id);
  }

  clone(params: Partial<SwitchParams>) {
    const newParams = {
      id: this.id,
      label: this.label,
      levels: this.levels,
      activeLevel: this.activeLevelId,
      set: this.set,
      description: this.description,
      ...params,
    };
    return new Switch(newParams);
  }
}

export { Switch };
