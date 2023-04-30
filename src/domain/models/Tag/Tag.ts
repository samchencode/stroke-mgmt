class Tag {
  constructor(
    private readonly name: string,
    private readonly description: string = 'No description was provided for this tag.'
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
