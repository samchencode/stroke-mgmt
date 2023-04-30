class Tag {
  constructor(
    private readonly name: string,
    private readonly description: string
  ) {}

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  is(other: Tag) {
    return this.name === other.getName();
  }
}

export { Tag };
