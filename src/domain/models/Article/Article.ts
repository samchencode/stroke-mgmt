import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { BaseDesignation } from '@/domain/models/Article/Designation/BaseDesignation';
import type { Image } from '@/domain/models/Image';
import type { Tag } from '@/domain/models/Tag';

type ArticleParams = {
  id: ArticleId;
  title: string;
  html: string;
  summary?: string;
  designation: BaseDesignation;
  thumbnail?: Image;
  shouldShowOnHomeScreen: boolean;
  tags?: Tag[];
  lastUpdated: Date;
};

class Article {
  private id: ArticleId;

  private title: string;

  private html: string;

  private summary?: string;

  private desigation: BaseDesignation;

  private thumbnail?: Image;

  private tags: Map<string, Tag>;

  private shouldShowOnHomeScreen: boolean;

  private lastUpdated: Date;

  constructor({
    id,
    title,
    html,
    designation,
    thumbnail,
    summary,
    shouldShowOnHomeScreen,
    lastUpdated,
    tags = [],
  }: ArticleParams) {
    this.id = id;
    this.title = title;
    this.html = html;
    this.desigation = designation;
    this.thumbnail = thumbnail;
    this.summary = summary;
    this.tags = new Map(tags.map((t) => [t.getName(), t] as const));
    this.shouldShowOnHomeScreen = shouldShowOnHomeScreen;
    this.lastUpdated = lastUpdated;
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

  getSummary(sanitizeHtml: (html: string) => string): string {
    if (this.summary) return this.summary;
    const sanitizedBody = sanitizeHtml(this.html);
    return sanitizedBody.replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  getDesignation() {
    return this.desigation;
  }

  getTags() {
    return [...this.tags.values()];
  }

  hasTag(tag: Tag): boolean {
    return this.tags.has(tag.getName());
  }

  getshouldShowOnHomeScreen() {
    return this.shouldShowOnHomeScreen;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  is(v: Article) {
    return this.id.is(v.getId());
  }
}

export { Article };
