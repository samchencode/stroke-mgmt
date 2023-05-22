import { Tag } from '@/domain/models/Tag';
import { StrapiApiError } from '@/infrastructure/persistence/strapi/StrapiApiError';
import { StrapiTagRepository } from '@/infrastructure/persistence/strapi/StrapiTagRepository';

describe('StrapiTagRepository', () => {
  const strapiApiHost = 'http://localhost:1337';

  const mockNetworkInfo = {
    isInternetReachable: jest.fn().mockResolvedValue(true),
  };

  describe('Instantiation', () => {
    it('should be created with a api host', () => {
      const create = () =>
        new StrapiTagRepository(strapiApiHost, jest.fn(), mockNetworkInfo);
      expect(create).not.toThrow();
    });
  });

  describe('getAll', () => {
    it('should return an array of tags', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            {
              attributes: {
                Name: 'Test Tag 1',
                Description: 'This is a test tag 1.',
              },
            },
            {
              attributes: {
                Name: 'Test Tag 2',
                Description: 'This is a test tag 2.',
              },
            },
          ],
        }),
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      const repo = new StrapiTagRepository(
        strapiApiHost,
        mockFetch,
        mockNetworkInfo
      );

      const tags = await repo.getAll();
      expect(tags).toHaveLength(2);
      expect(tags[0]).toBeInstanceOf(Tag);
      expect(tags[0].getName()).toBe('Test Tag 1');
      expect(tags[0].getDescription()).toBe('This is a test tag 1.');
      expect(tags[1]).toBeInstanceOf(Tag);
      expect(tags[1].getName()).toBe('Test Tag 2');
      expect(tags[1].getDescription()).toBe('This is a test tag 2.');

      expect(mockFetch).toHaveBeenCalledWith(`${strapiApiHost}/api/tags`);
    });

    it('should throw a StrapiApiError if the response is not OK', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          data: null,
          error: {
            status: 500,
            name: 'Internal Server Error',
            message: 'Uh oh, something went wrong',
          },
        }),
      };

      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      const repo = new StrapiTagRepository(
        strapiApiHost,
        mockFetch,
        mockNetworkInfo
      );
      await expect(repo.getAll()).rejects.toThrow(StrapiApiError);
      await expect(repo.getAll()).rejects.toThrow(
        'Uh oh, something went wrong'
      );

      expect(mockFetch).toHaveBeenCalledWith(`${strapiApiHost}/api/tags`);
    });
  });
});
