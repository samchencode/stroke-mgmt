import type { SwitchId } from '@/domain/models/Algorithm/SwitchId';

type SwitchParams = {
  id: SwitchId;
  label: string;
  value: number;
  active?: boolean;
  set?: boolean;
  description?: string;
};

class Switch {
  private id: SwitchId;

  private label: string;

  private value: number;

  private active: boolean;

  private set: boolean;

  private description?: string;

  constructor({
    id,
    label,
    value,
    description,
    active = false,
    set = false,
  }: SwitchParams) {
    this.id = id;
    this.label = label;
    this.value = value;
    this.active = active;
    this.set = set;
    this.description = description;
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

  getDescription() {
    return this.description;
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
