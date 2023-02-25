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

type Fetch = typeof fetch;

class StrapiArticleRepository implements ArticleRepository {
  constructor(private strapiHostUrl: string, private fetch: Fetch) {}

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
    const { data } = await this.get(
      '/api/articles?populate[0]=outcomes&populate[1]=switches&populate[2]=outcomes.criterion'
    );
    return (data as StrapiArticleData[]).map(strapiResponseToArticle);
  }

  async getById(id: ArticleId): Promise<Article> {
    const idString = id.toString();
    const { data } = await this.get(
      `/api/articles/${idString}?populate[0]=outcomes&populate[1]=switches&populate[2]=outcomes.criterion`
    );
    return strapiResponseToArticle(data as StrapiArticleData);
  }

  async getByDesignation(d: BaseDesignation): Promise<Article[]> {
    let designationName = d.toString();
    if (designationName === 'StrokeFacts') designationName = 'Stroke Facts';
    if (designationName === 'StrokeSigns') designationName = 'Stroke Signs';

    const { data } = await this.get(
      `/api/articles/?filters[Designation]=${encodeURI(designationName)}`
    );
    return (data as StrapiArticleData[]).map(strapiResponseToArticle);
  }
}

export { StrapiArticleRepository };
