import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { Image } from '@/domain/models/Image';
import { Tag } from '@/domain/models/Tag';
import { filterArticlesByTags } from '@/domain/services/filterArticlesByTags';

describe('filterArticlesByTags', () => {
  const tag1 = new Tag('tag1');
  const tag2 = new Tag('tag2');
  const article1 = new Article({
    id: new ArticleId('1'),
    title: 'Article 1',
    html: '<p>Article 1 content</p>',
    designation: Designation.ARTICLE,
    thumbnail: new Image('https://example.com/image1.jpg'),
    summary: 'Article 1 summary',
    tags: [tag1],
    shouldShowOnHomeScreen: true,
  });
  const article2 = new Article({
    id: new ArticleId('2'),
    title: 'Article 2',
    html: '<p>Article 2 content</p>',
    designation: Designation.ARTICLE,
    thumbnail: new Image('https://example.com/image2.jpg'),
    summary: 'Article 2 summary',
    tags: [tag1, tag2],
    shouldShowOnHomeScreen: true,
  });
  const article3 = new Article({
    id: new ArticleId('3'),
    title: 'Article 3',
    html: '<p>Article 3 content</p>',
    designation: Designation.ARTICLE,
    thumbnail: new Image('https://example.com/image3.jpg'),
    summary: 'Article 3 summary',
    tags: [tag2],
    shouldShowOnHomeScreen: true,
  });

  it('should return articles that have a single tag', () => {
    const filteredArticles = filterArticlesByTags(
      [article1, article2, article3],
      [tag1]
    );
    expect(filteredArticles).toEqual([article1, article2]);
  });

  it('should return articles that have multiple tags', () => {
    const filteredArticles = filterArticlesByTags(
      [article1, article2, article3],
      [tag1, tag2]
    );
    expect(filteredArticles).toEqual([article2]);
  });

  it('should return empty array if no article matches the given tags', () => {
    const filteredArticles = filterArticlesByTags(
      [article1, article2, article3],
      [new Tag('tag3')]
    );
    expect(filteredArticles).toEqual([]);
  });
});
