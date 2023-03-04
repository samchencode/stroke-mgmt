import type {
  Algorithm,
  AlgorithmId,
  AlgorithmRepository,
} from '@/domain/models/Algorithm';
import { StrapiApiError } from '@/infrastructure/persistence/strapi/StrapiApiError';
import type {
  StrapiAlgorithmData,
  StrapiApiResponse,
  StrapiErrorResponse,
} from '@/infrastructure/persistence/strapi/StrapiApiResponse';
import { strapiResponseToAlgorithm } from '@/infrastructure/persistence/strapi/StrapiAlgorithmRepository/strapiResponseToAlgorithm';

type Fetch = typeof fetch;

class StrapiAlgorihtmRepository implements AlgorithmRepository {
  constructor(private strapiHostUrl: string, private fetch: Fetch) {}

  private async get(uri: string) {
    const url = this.strapiHostUrl + uri;
    const response = await this.fetch(url);
    const json = await response.json();
    if (!response.ok) {
      throw new StrapiApiError(json as StrapiErrorResponse);
    }
    return json as StrapiApiResponse<StrapiAlgorithmData>;
  }

  async getAll(): Promise<Algorithm[]> {
    const { data } = await this.get(
      '/api/algorithms?populate[0]=outcomes&populate[1]=switches&populate[2]=outcomes.criterion&populate[3]=outcomes.next'
    );
    return (data as StrapiAlgorithmData[]).map(strapiResponseToAlgorithm);
  }

  async getById(id: AlgorithmId): Promise<Algorithm> {
    const idString = id.toString();
    const { data } = await this.get(
      `/api/algorithms/${idString}?populate[0]=outcomes&populate[1]=switches&populate[2]=outcomes.criterion&populate[3]=outcomes.next`
    );
    return strapiResponseToAlgorithm(data as StrapiAlgorithmData);
  }
}

export { StrapiAlgorihtmRepository };
