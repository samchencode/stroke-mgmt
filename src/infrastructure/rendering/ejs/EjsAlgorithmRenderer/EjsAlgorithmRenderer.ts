import ejs from 'ejs';
import type {
  Algorithm,
  AlgorithmRenderer,
  Outcome,
} from '@/domain/models/Algorithm';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { EjsAlgorithmVisitor } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/EjsAlgorithmVisitor';

type TemplateGroup = {
  scoredAlgorithm: ejs.ClientFunction;
  textAlgorithm: ejs.ClientFunction;
  outcome: ejs.ClientFunction;
  partials: {
    [key: string]: string;
  };
};

class EjsAlgorithmRenderer implements AlgorithmRenderer {
  templates: Promise<TemplateGroup>;

  fs: FileSystem<unknown>;

  constructor(fileSystem: FileSystem<unknown>) {
    this.fs = fileSystem;
    this.templates = this.init();
  }

  async init(): Promise<TemplateGroup> {
    const assets = [
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/partials/style.ejs'),
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/partials/script.ejs'),
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/partials/head.ejs'),
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/textAlgorithm.ejs'),
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/scoredAlgorithm.ejs'),
      require('@/infrastructure/rendering/ejs/EjsAlgorithmRenderer/outcome.ejs'),
    ];
    const promises = assets.map((mod) => this.fs.getAssetAsString(mod));
    const [
      styleEjs,
      scriptEjs,
      headEjs,
      textAlgorithmEjs,
      scoredAlgorithmEjs,
      outcomeEjs,
    ] = await Promise.all(promises);
    return {
      textAlgorithm: ejs.compile(textAlgorithmEjs, { client: true }),
      scoredAlgorithm: ejs.compile(scoredAlgorithmEjs, { client: true }),
      outcome: ejs.compile(outcomeEjs, { client: true }),
      partials: {
        head: headEjs,
        script: scriptEjs,
        style: styleEjs,
      },
    };
  }

  async renderAlgorithm(algorithm: Algorithm): Promise<string> {
    const {
      textAlgorithm: textTemplate,
      scoredAlgorithm: scoredTemplate,
      partials,
    } = await this.templates;
    const visitor = new EjsAlgorithmVisitor(textTemplate, scoredTemplate);
    visitor.visit(algorithm);

    const includePartial = (name: string) => {
      if (!(name in partials))
        throw new Error(`Unknown partial included: ${name}`);
      return partials[name];
    };

    return visitor.render({ algorithm }, undefined, includePartial);
  }

  async renderOutcome(outcome: Outcome): Promise<string> {
    const { outcome: template } = await this.templates;
    return template({ outcome });
  }
}

export { EjsAlgorithmRenderer };
