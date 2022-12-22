import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { AlgorithmInfo } from '@/domain/models/Algorithm/AlgorithmInfo';
import type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
import { NoSwitchesError } from '@/domain/models/Algorithm/NoSwitchesError';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { Switch } from '@/domain/models/Algorithm/Switch';

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
    if (!this.hasOutcome()) return [];
    const outcomes = this.info.getOutcomes();
    const score = this.calculateScore();
    return outcomes.filter((o) => o.checkCriterion(score));
  }

  hasOutcome(): boolean {
    const hasUnsetSwitches = !!this.switches.find((s) => !s.isSet());
    const outcomes = this.info.getOutcomes();
    if (hasUnsetSwitches || outcomes.length === 0) return false;
    return true;
  }

  calculateScore() {
    const activeSwitches = this.switches.filter((s) => s.isActive());
    return activeSwitches.reduce((ag, v) => ag + v.getValue(), 0);
  }

  toggleSwitch(s: Switch) {
    const targetSwitch = this.switches.find((ss) => s.is(ss));
    if (!targetSwitch) return this;
    const otherSwitches = this.switches.filter((ss) => !s.is(ss));
    const newSwitch = targetSwitch.setSwitchTo(!targetSwitch.isActive());
    const switches = [newSwitch, ...otherSwitches];
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

  getSwitches(): Switch[] {
    return this.switches;
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
