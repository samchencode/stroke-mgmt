abstract class BaseDesignation {
  abstract readonly type: string;

  toString() {
    return this.type;
  }

  is(v: BaseDesignation): boolean {
    return v.type === this.type;
  }
}

export { BaseDesignation };
