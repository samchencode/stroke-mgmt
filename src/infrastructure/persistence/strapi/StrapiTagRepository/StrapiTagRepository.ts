import { Tag } from '@/domain/models/Tag';
import type { TagRepository } from '@/domain/models/Tag';
import { StrapiApiError } from '@/infrastructure/persistence/strapi/StrapiApiError';
import type {
  StrapiPluralApiResponse,
  StrapiErrorResponse,
  StrapiTag,
} from '@/infrastructure/persistence/strapi/StrapiApiResponse';

type Fetch = typeof fetch;

type StrapiResponse = StrapiErrorResponse | StrapiPluralApiResponse<StrapiTag>;

class StrapiTagRepository implements TagRepository {
  constructor(
    private readonly strapiHostUrl: string,
    private readonly fetch: Fetch
  ) {}

  private async get(): Promise<StrapiPluralApiResponse<StrapiTag>> {
    const url = `${this.strapiHostUrl}/api/tags`;
    const response = await this.fetch(url);
    const json = (await response.json()) as StrapiResponse;
    if (!response.ok) {
      throw new StrapiApiError(json as StrapiErrorResponse);
    }
    return json as StrapiPluralApiResponse<StrapiTag>;
  }

  async getAll(): Promise<Tag[]> {
    const { data } = await this.get();
    return data.map(
      (d) => new Tag(d.attributes.Name, d.attributes.Description ?? undefined)
    );
  }
}

export { StrapiTagRepository };
