import { Tag } from '@/domain/models/Tag';
import type { TagRepository } from '@/domain/models/Tag';
import type { NetworkInfo } from '@/infrastructure/network-info/NetworkInfo';
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
    private readonly fetch: Fetch,
    private readonly networkInfo: NetworkInfo
  ) {}

  static $inject = ['strapiHostUrl', 'fetch', 'networkInfo'];

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
      (d) =>
        new Tag(
          d.attributes.Name,
          new Date(d.attributes.updatedAt),
          d.attributes.Description ?? undefined
        )
    );
  }

  async isAvailable(): Promise<boolean> {
    return this.networkInfo.isInternetReachable();
  }
}

export { StrapiTagRepository };
