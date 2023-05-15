class Tag {
  constructor(
    private readonly name: string,
    private readonly updatedAt: Date,
    private readonly description: string = 'No description was provided for this tag.'
  ) {}

  getName() {
    return this.name;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getDescription() {
    return this.description;
  }

  is(other: Tag) {
    return this.name === other.getName();
  }
}

export { Tag };
