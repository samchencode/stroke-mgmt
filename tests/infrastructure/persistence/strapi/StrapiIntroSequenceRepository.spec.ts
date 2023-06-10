import { AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleId } from '@/domain/models/Article';
import {
  IntroSequence,
  IntroSequenceInvalidError,
} from '@/domain/models/IntroSequence';
import type { NetworkInfo } from '@/infrastructure/network-info/NetworkInfo';
import { StrapiApiError } from '@/infrastructure/persistence/strapi/StrapiApiError';
import { StrapiIntroSequenceRepository } from '@/infrastructure/persistence/strapi/StrapiIntroSequenceRepository/StrapiIntroSequenceRepository';

const emptyResponse = {
  data: {
    id: 2,
    attributes: {
      createdAt: '2023-06-09T14:30:30.532Z',
      updatedAt: '2023-06-10T14:30:30.532Z',
      articles: {
        data: [],
      },
      suggestedAlgorithm: {
        data: null,
      },
      suggestAlgorithmAfterArticle: {
        data: null,
      },
    },
  },
  meta: {},
};

const successfulResponse = {
  data: {
    id: 2,
    attributes: {
      createdAt: '2023-06-10T14:30:30.532Z',
      updatedAt: '2023-06-10T14:41:51.954Z',
      articles: {
        data: [
          {
            id: 5,
            attributes: {},
          },
          {
            id: 4,
            attributes: {},
          },
        ],
      },
      suggestedAlgorithm: {
        data: {
          id: 1,
          attributes: {},
        },
      },
      suggestAlgorithmAfterArticle: {
        data: {
          id: 5,
          attributes: {},
        },
      },
    },
  },
  meta: {},
};

const errorResponse = {
  data: null,
  error: {
    status: 500,
    name: 'InternalServerError',
    message: 'Internal Server Error',
  },
};

describe('StrapiIntroSequenceRepository', () => {
  const strapiHostUrl = 'http://www.mysite.com';
  const fakeFetch = jest.fn();
  const networkInfo = {
    isInternetReachable: jest.fn(),
  } satisfies NetworkInfo;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Instantiation', () => {
    it('should be created with host, fetch, and networkinfo', () => {
      const create = () =>
        new StrapiIntroSequenceRepository(
          strapiHostUrl,
          fakeFetch,
          networkInfo
        );
      expect(create).not.toThrow();
    });
  });

  describe('#get', () => {
    it('should retrieve data and return intro sequence', async () => {
      fakeFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(successfulResponse),
      });
      const repo = new StrapiIntroSequenceRepository(
        strapiHostUrl,
        fakeFetch,
        networkInfo
      );
      const result = await repo.get();
      expect(result).toBeInstanceOf(IntroSequence);
      expect(result.getArticleIds()).toHaveLength(2);
      const [id1, id2] = result.getArticleIds();
      expect(id1.is(new ArticleId('5'))).toBe(true);
      expect(id2.is(new ArticleId('4'))).toBe(true);
      expect(result.getSuggestedAlgorithmId().is(new AlgorithmId('1'))).toBe(
        true
      );
      expect(
        result.getSuggestAlgorithmAfterArticleId().is(new ArticleId('5'))
      ).toBe(true);
      expect(result.getLastUpdated().getTime()).toEqual(1686408111954);
    });

    it('should throw if intro sequence attributes are null', async () => {
      fakeFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(emptyResponse),
      });
      const repo = new StrapiIntroSequenceRepository(
        strapiHostUrl,
        fakeFetch,
        networkInfo
      );
      const boom = repo.get();
      await expect(boom).rejects.toThrow(IntroSequenceInvalidError);
      await expect(boom).rejects.toThrow('suggestedAlgorithmId=null');
      await expect(boom).rejects.toThrow('suggestAlgorithmAfterArticleId=null');
    });

    it('should throw error if response is not ok', async () => {
      fakeFetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });
      const repo = new StrapiIntroSequenceRepository(
        strapiHostUrl,
        fakeFetch,
        networkInfo
      );
      const boom = repo.get();
      await expect(boom).rejects.toThrow(StrapiApiError);
      await expect(boom).rejects.toThrow('Internal Server Error');
    });
  });

  describe('#isAvailable', () => {
    it('should report whether network is available', async () => {
      networkInfo.isInternetReachable.mockResolvedValue(true);
      const repo = new StrapiIntroSequenceRepository(
        strapiHostUrl,
        fakeFetch,
        networkInfo
      );
      const result = await repo.isAvailable();
      expect(result).toBe(true);
    });
  });
});
