class ArticleId {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  is(v: ArticleId) {
    return this.id === v.getId();
  }

  toString() {
    return this.getId();
  }
}

export { ArticleId };
