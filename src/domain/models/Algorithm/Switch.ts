import type { SwitchId } from '@/domain/models/Algorithm/SwitchId';

type SwitchParams = {
  id: SwitchId;
  label: string;
  value: number;
  active?: boolean;
  set?: boolean;
};

class Switch {
  private id: SwitchId;

  private label: string;

  private value: number;

  private active: boolean;

  private set: boolean;

  constructor({ id, label, value, active = false, set = false }: SwitchParams) {
    this.id = id;
    this.label = label;
    this.value = value;
    this.active = active;
    this.set = set;
  }

  setSwitchTo(active: boolean) {
    return this.clone({ set: true, active });
  }

  getId() {
    return this.id;
  }

  getLabel() {
    return this.label;
  }

  getValue() {
    return this.value;
  }

  isActive() {
    return this.active;
  }

  isSet() {
    return this.set;
  }

  is(other: Switch) {
    if (other.getId().is(this.id)) return true;
    return false;
  }

  clone(params: Partial<SwitchParams>) {
    const newParams = {
      id: this.id,
      label: this.label,
      value: this.value,
      active: this.active,
      set: this.set,
      ...params,
    };
    return new Switch(newParams);
  }
}

export { Switch };
