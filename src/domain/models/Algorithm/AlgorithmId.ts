class AlgorithmId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  is(v: AlgorithmId) {
    return this.id === v.getId();
  }

  toString() {
    return this.getId();
  }
}

export { AlgorithmId };
