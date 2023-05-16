class Tag {
  constructor(
    private readonly name: string,
    private readonly lastUpdated: Date,
    private readonly description: string = 'No description was provided for this tag.'
  ) {}

  getName() {
    return this.name;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  getDescription() {
    return this.description;
  }

  is(other: Tag) {
    return this.name === other.getName();
  }
}

export { Tag };
