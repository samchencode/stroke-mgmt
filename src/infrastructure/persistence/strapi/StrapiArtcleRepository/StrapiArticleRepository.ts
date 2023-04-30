import { StrapiApiError } from '@/infrastructure/persistence/strapi/StrapiApiError';
import type {
  StrapiApiResponse,
  StrapiArticleData,
  StrapiErrorResponse,
} from '@/infrastructure/persistence/strapi/StrapiApiResponse';
import type {
  Article,
  ArticleId,
  ArticleRepository,
  BaseDesignation,
} from '@/domain/models/Article';
import { strapiResponseToArticle } from '@/infrastructure/persistence/strapi/StrapiArtcleRepository/strapiResponseToArticle';
import type { ImageRepository } from '@/domain/models/Image';

type Fetch = typeof fetch;

class StrapiArticleRepository implements ArticleRepository {
  constructor(
    private strapiHostUrl: string,
    private fetch: Fetch,
    private placeholderImageRepository: ImageRepository
  ) {}

  private async get(uri: string) {
    const url = this.strapiHostUrl + uri;
    const response = await this.fetch(url);
    const json = await response.json();
    if (!response.ok) {
      throw new StrapiApiError(json as StrapiErrorResponse);
    }
    return json as StrapiApiResponse<StrapiArticleData>;
  }

  async getAll(): Promise<Article[]> {
    const { data } = await this.get('/api/articles?populate[0]=Thumbnail');
    const promises = (data as StrapiArticleData[]).map((d) =>
      this.getDefaultThumbnailAndMakeArticle(d)
    );
    return Promise.all(promises);
  }

  async getById(id: ArticleId): Promise<Article> {
    const idString = id.toString();
    const { data } = await this.get(
      `/api/articles/${idString}?populate[0]=Thumbnail`
    );
    return this.getDefaultThumbnailAndMakeArticle(data as StrapiArticleData);
  }

  async getByDesignation(designation: BaseDesignation): Promise<Article[]> {
    let designationName = designation.toString();
    if (designationName === 'StrokeFacts') designationName = 'Stroke Facts';
    if (designationName === 'StrokeSigns') designationName = 'Stroke Signs';

    const { data } = await this.get(
      `/api/articles/?filters[Designation]=${encodeURI(
        designationName
      )}&populate[0]=Thumbnail`
    );
    const promises = (data as StrapiArticleData[]).map((d) =>
      this.getDefaultThumbnailAndMakeArticle(d)
    );
    return Promise.all(promises);
  }

  private async getDefaultThumbnailAndMakeArticle(data: StrapiArticleData) {
    const { id } = data;
    const placeholderImage =
      await this.placeholderImageRepository.getDeterministicImageForString(
        `article-${id.toString()}`
      );
    return strapiResponseToArticle(placeholderImage, this.strapiHostUrl, data);
  }
}

export { StrapiArticleRepository };
