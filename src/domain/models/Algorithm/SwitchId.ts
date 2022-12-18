class SwitchId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  is(v: SwitchId) {
    return this.id === v.getId();
  }

  toString() {
    return this.getId();
  }
}

export { SwitchId };
