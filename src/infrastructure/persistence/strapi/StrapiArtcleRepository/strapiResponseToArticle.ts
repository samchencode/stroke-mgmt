import type { BaseDesignation } from '@/domain/models/Article';
import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { Image } from '@/domain/models/Image';
import type { StrapiArticleData } from '@/infrastructure/persistence/strapi/StrapiApiResponse';

export const strapiResponseToArticle = (
  defaultThumbnail: Image,
  strapiHostUrl: string,
  { id, attributes }: StrapiArticleData
): Article => {
  let designation: BaseDesignation = Designation.ARTICLE;
  switch (attributes.Designation) {
    case 'Stroke Signs':
      designation = Designation.STROKE_SIGNS;
      break;
    case 'Stroke Facts':
      designation = Designation.STROKE_FACTS;
      break;
    case 'Disclaimer':
      designation = Designation.DISCLAIMER;
      break;
    default:
      break;
  }

  let thumbnail = defaultThumbnail;
  if (attributes.Thumbnail && attributes.Thumbnail?.data !== null) {
    thumbnail = new Image(
      strapiHostUrl + attributes.Thumbnail.data.attributes.formats.thumbnail.url
    );
  }

  return new Article({
    id: new ArticleId(id.toString()),
    title: attributes.Title,
    html: attributes.Body,
    designation,
    summary: attributes.Summary ?? '',
    thumbnail,
    shouldShowOnHomeScreen: attributes.ShowOnHomeScreen ?? true,
  });
};
