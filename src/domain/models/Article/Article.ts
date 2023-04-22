import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { BaseDesignation } from '@/domain/models/Article/Designation/BaseDesignation';
import type { Image } from '@/domain/models/Image';

type ArticleParams = {
  id: ArticleId;
  title: string;
  html: string;
  summary: string;
  designation: BaseDesignation;
  thumbnail: Image;
};

class Article {
  private id: ArticleId;

  private title: string;

  private html: string;

  private summary: string;

  private desigation: BaseDesignation;

  private thumbnail: Image;

  constructor({
    id,
    title,
    html,
    designation,
    thumbnail,
    summary,
  }: ArticleParams) {
    this.id = id;
    this.title = title;
    this.html = html;
    this.desigation = designation;
    this.thumbnail = thumbnail;
    this.summary = summary;
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

  getThumbnail() {
    return this.thumbnail;
  }

  getSummary() {
    return this.summary;
  }

  getDesignation() {
    return this.desigation;
  }

  is(v: Article) {
    return this.id.is(v.getId());
  }
}

export { Article };
