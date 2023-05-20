import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type {
  AlgorithmInfo,
  AlgorithmParams,
} from '@/domain/models/Algorithm/AlgorithmInfo';
import type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
import { NoSwitchesError } from '@/domain/models/Algorithm/NoSwitchesError';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type {
  Switch,
  SwitchId,
  LevelId,
} from '@/domain/models/Algorithm/Switch';
import type { Image } from '@/domain/models/Image';

type ScoredAlgorithmParams = {
  info: AlgorithmInfo;
  switches: Switch[];
};

class ScoredAlgorithm implements Algorithm {
  private info: AlgorithmInfo;

  private switches: Switch[];

  constructor({ info, switches }: ScoredAlgorithmParams) {
    this.info = info;
    this.switches = switches;
    if (switches.length === 0) throw new NoSwitchesError(info.getTitle());
  }

  getOutcomes(): Outcome[] {
    if (!this.hasOutcomes()) return [];
    const outcomes = this.info.getOutcomes();
    const score = this.calculateScore();
    return outcomes.filter((o) => o.checkCriterion(score));
  }

  hasOutcomes(): boolean {
    const hasUnsetSwitches = !!this.switches.find((s) => !s.isSet());
    const outcomes = this.info.getOutcomes();
    if (hasUnsetSwitches || outcomes.length === 0) return false;
    return true;
  }

  calculateScore() {
    return this.switches.reduce((ag, v) => ag + v.getValue(), 0);
  }

  setSwitchById(id: SwitchId, levelId: LevelId) {
    const targetSwitchIdx = this.switches.findIndex((ss) => id.is(ss.getId()));
    if (targetSwitchIdx === -1) throw new Error(`switch id ${id} not found`);
    const targetSwitch = this.switches[targetSwitchIdx];
    const newSwitch = targetSwitch.setSwitchTo(levelId);
    const switches = this.switches.slice();
    switches.splice(targetSwitchIdx, 1, newSwitch);
    return this.clone({ switches });
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

  getSwitches(): Switch[] {
    return this.switches;
  }

  getShouldShowOnHomeScreen(): boolean {
    return this.info.getShouldShowOnHomeScreen();
  }

  getLastUpdated(): Date {
    return this.info.getLastUpdated();
  }

  is(other: Algorithm): boolean {
    return other.getId().is(this.getId());
  }

  clone(params: Partial<ScoredAlgorithmParams>) {
    const newParams = {
      info: this.info,
      switches: this.switches,
      ...params,
    };
    return new ScoredAlgorithm(newParams);
  }

  acceptVisitor(v: AlgorithmVisitor): void {
    v.visitScoredAlgorithm(this);
  }
}

export { ScoredAlgorithm };
