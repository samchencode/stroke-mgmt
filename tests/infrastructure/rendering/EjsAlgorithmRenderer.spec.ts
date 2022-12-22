import { AlgorithmId } from '@/domain/models/Algorithm';
import { NodeFileSystem } from '@/infrastructure/file-system/node/NodeFileSystem';
import { FakeAlgorithmRepository } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository';
import { EjsAlgorithmRenderer } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';

describe('EjsAlgorithmRenderer', () => {
  let repo: FakeAlgorithmRepository;
  let fs: NodeFileSystem;
  beforeAll(() => {
    jest.resetModules();
    jest.doMock(
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/textAlgorithm.ejs',
      () =>
        '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/textAlgorithm.ejs'
    );
    jest.doMock(
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/scoredAlgorithm.ejs',
      () =>
        '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/scoredAlgorithm.ejs'
    );
    fs = new NodeFileSystem();
    repo = new FakeAlgorithmRepository();
  });

  describe('Instantiation', () => {
    it('should be created given file system with template', () => {
      const create = () => new EjsAlgorithmRenderer(fs);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should render text algorithm', async () => {
      const textAlgo = await repo.getById(new AlgorithmId('0'));
      const renderer = new EjsAlgorithmRenderer(fs);
      const result = await renderer.render(textAlgo);
      expect(result).toMatchSnapshot();
    });

    it('should render scored algorithm', async () => {
      const scoredAlgo = await repo.getById(new AlgorithmId('1'));
      const renderer = new EjsAlgorithmRenderer(fs);
      const result = await renderer.render(scoredAlgo);
      expect(result).toMatchSnapshot();
    });
  });
});
