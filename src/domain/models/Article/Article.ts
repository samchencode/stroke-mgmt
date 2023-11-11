import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { BaseDesignation } from '@/domain/models/Article/Designation/BaseDesignation';
import type { Citation } from '@/domain/models/Citation';
import type { Image } from '@/domain/models/Image';
import type { Tag } from '@/domain/models/Tag';

type ArticleParams = {
  id: ArticleId;
  title: string;
  html: string;
  summary?: string;
  designation: BaseDesignation;
  thumbnail: Image;
  shouldShowOnHomeScreen: boolean;
  tags?: Tag[] | Map<string, Tag>;
  lastUpdated: Date;
  citations: Citation[];
};

class Article {
  private id: ArticleId;

  private title: string;

  private html: string;

  private summary?: string;

  private desigation: BaseDesignation;

  private thumbnail: Image;

  private tags: Map<string, Tag>;

  private shouldShowOnHomeScreen: boolean;

  private lastUpdated: Date;

  private citations: Citation[];

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
    citations = [],
  }: ArticleParams) {
    this.id = id;
    this.title = title;
    this.html = html;
    this.desigation = designation;
    this.thumbnail = thumbnail;
    this.summary = summary;
    this.tags =
      tags instanceof Map
        ? tags
        : new Map(tags.map((t) => [t.getName(), t] as const));
    this.shouldShowOnHomeScreen = shouldShowOnHomeScreen;
    this.lastUpdated = lastUpdated;
    this.citations = citations;
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

  getSummaryOrNull(): string | null {
    return this.summary ?? null;
  }

  getDesignation() {
    return this.desigation;
  }

  getTags() {
    return [...this.tags.values()];
  }

  getCitations() {
    return this.citations;
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

  clone(newParams: Partial<ArticleParams>) {
    return new Article({
      id: this.id,
      title: this.title,
      html: this.html,
      designation: this.desigation,
      thumbnail: this.thumbnail,
      summary: this.summary,
      shouldShowOnHomeScreen: this.shouldShowOnHomeScreen,
      lastUpdated: this.lastUpdated,
      tags: this.tags,
      citations: this.citations,
      ...newParams,
    });
  }
}

export { Article };
