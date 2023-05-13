import { Article } from '@/domain/models/Article/Article';
import { ArticleId } from '@/domain/models/Article/ArticleId';
import { Designation } from '@/domain/models/Article/Designation';

const id = new ArticleId('%%%NULL%%%');

class NullArticle extends Article {
  constructor() {
    super({
      id,
      title: 'Article Not Found',
      html: "The article you're looking for could not be found.",
      summary: "The article you're looking for could not be found.",
      designation: Designation.ARTICLE,
      shouldShowOnHomeScreen: false,
      tags: [],
      lastUpdated: new Date(0),
    });
  }
}

export { NullArticle };
