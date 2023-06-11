import { AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleId } from '@/domain/models/Article';
import type { IntroSequenceRepository } from '@/domain/models/IntroSequence';
import {
  IntroSequence,
  IntroSequenceInvalidError,
} from '@/domain/models/IntroSequence';
import type { NetworkInfo } from '@/infrastructure/network-info/NetworkInfo';
import { StrapiApiError } from '@/infrastructure/persistence/strapi/StrapiApiError';
import type {
  StrapiErrorResponse,
  StrapiIntroSequence,
  StrapiSingularApiResponse,
} from '@/infrastructure/persistence/strapi/StrapiApiResponse';

type Fetch = typeof fetch;

type StrapiResponse =
  | StrapiErrorResponse
  | StrapiSingularApiResponse<StrapiIntroSequence>;

const searchParamRecord = {
  'populate[articles][fields][0]': 'id',
  'populate[suggestedAlgorithm][fields][0]': 'id',
  'populate[suggestAlgorithmAfterArticle][fields][0]': 'id',
};

const searchParams = new URLSearchParams(searchParamRecord);

class StrapiIntroSequenceRepository implements IntroSequenceRepository {
  constructor(
    private readonly strapiHostUrl: string,
    private readonly fetch: Fetch,
    private readonly networkInfo: NetworkInfo
  ) {}

  private async getFromApi() {
    const url = `${this.strapiHostUrl}/api/intro-sequence?${searchParams}`;
    const response = await this.fetch(url);
    const data = (await response.json()) as StrapiResponse;

    if (!response.ok) throw new StrapiApiError(data as StrapiErrorResponse);
    return data as StrapiSingularApiResponse<StrapiIntroSequence>;
  }

  async get(): Promise<IntroSequence> {
    const { attributes } = (await this.getFromApi()).data;
    if (
      !attributes.suggestedAlgorithm.data ||
      !attributes.suggestAlgorithmAfterArticle.data
    )
      throw new IntroSequenceInvalidError(
        attributes.articles.data,
        attributes.suggestedAlgorithm.data?.id ?? null,
        attributes.suggestAlgorithmAfterArticle.data?.id ?? null
      );

    return new IntroSequence(
      attributes.articles.data.map((data) => new ArticleId(data.id.toString())),
      new AlgorithmId(attributes.suggestedAlgorithm.data.id.toString()),
      new ArticleId(attributes.suggestAlgorithmAfterArticle.data.id.toString()),
      new Date(attributes.updatedAt)
    );
  }

  isAvailable(): Promise<boolean> {
    return this.networkInfo.isInternetReachable();
  }
}

export { StrapiIntroSequenceRepository };
