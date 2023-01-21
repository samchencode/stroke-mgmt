import { AlgorithmId } from '@/domain/models/Algorithm';
import { NodeFileSystem } from '@/infrastructure/file-system/node/NodeFileSystem';
import { FakeAlgorithmRepository } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository';
import { EjsAlgorithmRenderer } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';

describe('EjsAlgorithmRenderer', () => {
  let repo: FakeAlgorithmRepository;
  let fs: NodeFileSystem;
  beforeAll(() => {
    jest.resetModules();
    const assets = [
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/partials/style.ejs',
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/partials/script.ejs',
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/partials/head.ejs',
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/textAlgorithm.ejs',
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/scoredAlgorithm.ejs',
      '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/outcome.ejs',
    ];
    assets.forEach((a) => jest.doMock(a, () => a));
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
      const result = await renderer.renderAlgorithm(textAlgo);
      expect(result).toMatchSnapshot();
    });

    it('should render scored algorithm', async () => {
      const scoredAlgo = await repo.getById(new AlgorithmId('1'));
      const renderer = new EjsAlgorithmRenderer(fs);
      const result = await renderer.renderAlgorithm(scoredAlgo);
      expect(result).toMatchSnapshot();
    });
  });
});
