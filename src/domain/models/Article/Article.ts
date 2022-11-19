import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { BaseDesignation } from '@/domain/models/Article/Designation/BaseDesignation';

type ArticleParams = {
  id: ArticleId;
  title: string;
  html: string;
  designation: BaseDesignation;
};

class Article {
  private id: ArticleId;

  private title: string;

  private html: string;

  private desigation: BaseDesignation;

  constructor({ id, title, html, designation }: ArticleParams) {
    this.id = id;
    this.title = title;
    this.html = html;
    this.desigation = designation;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getHtml() {
    return this.html;
  }

  getDesignation() {
    return this.desigation;
  }

  is(v: Article) {
    return this.id.is(v.getId());
  }
}

export { Article };
