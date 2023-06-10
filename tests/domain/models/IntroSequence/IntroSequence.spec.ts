import { AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleId } from '@/domain/models/Article';
import { IntroSequence } from '@/domain/models/IntroSequence';

describe('IntroSequence', () => {
  describe('Instantiation', () => {
    it('should be created with attributes', () => {
      const create = () =>
        new IntroSequence(
          [new ArticleId('4'), new ArticleId('5')],
          new AlgorithmId('1'),
          new ArticleId('5'),
          new Date(0)
        );

      expect(create).not.toThrow();
    });
  });

  describe('Validation', () => {
    it('should throw if article ids array is empty', () => {
      const boom = () =>
        new IntroSequence(
          [],
          new AlgorithmId('1'),
          new ArticleId('5'),
          new Date(0)
        );
      expect(boom).toThrow('articleIds=[]');
    });

    it('should throw if article id to suggest after is not in article ids array', () => {
      const boom = () =>
        new IntroSequence(
          [new ArticleId('4'), new ArticleId('5')],
          new AlgorithmId('1'),
          new ArticleId('Some unknown id'),
          new Date(0)
        );

      expect(boom).toThrow('articleIds=[4,5]');
      expect(boom).toThrow('suggestAlgorithmAfterArticleId=Some unknown id');
    });
  });
});
