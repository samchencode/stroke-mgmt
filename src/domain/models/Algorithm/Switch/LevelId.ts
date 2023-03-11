class LevelId {
  constructor(private readonly id: string) {}

  getId() {
    return this.id;
  }

  is(v: LevelId) {
    return this.id === v.getId();
  }

  toString() {
    return this.getId();
  }
}

export { LevelId };
