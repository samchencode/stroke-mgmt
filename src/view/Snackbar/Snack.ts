type Action = {
  readonly label: string;
  readonly onPress: () => void;
};

class Snack {
  constructor(
    public readonly message: string,
    public readonly action?: Action,
    public readonly dwellMilliseconds: number = 4000
  ) {}
}

export { Snack, Action };
