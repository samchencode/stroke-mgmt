import ejs from 'ejs';
import type {
  Algorithm,
  AlgorithmRenderer,
  Outcome,
} from '@/domain/models/Algorithm';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { EjsAlgorithmVisitor } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/EjsAlgorithmVisitor';

class EjsAlgorithmRenderer implements AlgorithmRenderer {
  ready: Promise<void>;

  fs: FileSystem<unknown>;

  textAlgorithmTemplate: ejs.TemplateFunction | null = null;

  scoredAlgorithmTemplate: ejs.TemplateFunction | null = null;

  outcomeTemplate: ejs.TemplateFunction | null = null;

  constructor(fileSystem: FileSystem<unknown>) {
    this.fs = fileSystem;
    this.ready = this.init();
  }

  async init(): Promise<void> {
    const textAlgo = await this.fs.getAssetAsString(
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/textAlgorithm.ejs')
    );
    this.textAlgorithmTemplate = ejs.compile(textAlgo);
    const scoredAlgo = await this.fs.getAssetAsString(
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/scoredAlgorithm.ejs')
    );
    this.scoredAlgorithmTemplate = ejs.compile(scoredAlgo);
    const outcome = await this.fs.getAssetAsString(
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/outcome.ejs')
    );
    this.outcomeTemplate = ejs.compile(outcome);
  }

  async renderAlgorithm(algorithm: Algorithm): Promise<string> {
    await this.ready;
    if (!this.textAlgorithmTemplate || !this.scoredAlgorithmTemplate)
      throw Error('Algorithm templates not found!');

    const visitor = new EjsAlgorithmVisitor(
      this.textAlgorithmTemplate,
      this.scoredAlgorithmTemplate
    );
    visitor.visit(algorithm);
    return visitor.getRenderedHtml();
  }

  async renderOutcome(outcome: Outcome): Promise<string> {
    await this.ready;
    if (!this.outcomeTemplate) throw Error('Outcome template not found!');
    return this.outcomeTemplate({ outcome });
  }
}

export { EjsAlgorithmRenderer };
