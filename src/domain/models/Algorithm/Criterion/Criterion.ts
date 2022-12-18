interface Criterion {
  check(v: number): boolean;
  is(other: Criterion): boolean;
}

export type { Criterion };
