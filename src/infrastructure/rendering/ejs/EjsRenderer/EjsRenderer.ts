import ejs from 'ejs';
import type { Algorithm, AlgorithmRenderer } from '@/domain/models/Algorithm';
import type { Article, ArticleRenderer } from '@/domain/models/Article';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { EjsAlgorithmVisitor } from '@/infrastructure/rendering/ejs/EjsRenderer/EjsAlgorithmVisitor';

type TemplateGroup = {
  scoredAlgorithm: ejs.ClientFunction;
  textAlgorithm: ejs.ClientFunction;
  article: ejs.TemplateFunction;
  disclaimer: ejs.TemplateFunction;
  partials: {
    [key: string]: ejs.ClientFunction;
  };
};

const ejsOptions = { client: true, _with: false, localsName: 'data' } as const;

class EjsRenderer implements AlgorithmRenderer, ArticleRenderer {
  templates: Promise<TemplateGroup>;

  fs: FileSystem<unknown>;

  constructor(fileSystem: FileSystem<unknown>) {
    this.fs = fileSystem;
    this.templates = this.init();
  }

  static $inject = ['fileSystem'];

  async init(): Promise<TemplateGroup> {
    const assets = [
      require('@/infrastructure/rendering/ejs/EjsRenderer/partials/style.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/partials/script.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/partials/head.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/partials/noOutcomesYet.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/partials/outcomeList.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/textAlgorithm.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/scoredAlgorithm.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/article.ejs'),
      require('@/infrastructure/rendering/ejs/EjsRenderer/disclaimer.ejs'),
    ];
    const promises = assets.map((mod) => this.fs.getAssetAsString(mod));
    const [
      styleEjs,
      scriptEjs,
      headEjs,
      noOutcomesYetEjs,
      outcomeListEjs,
      textAlgorithmEjs,
      scoredAlgorithmEjs,
      articleEjs,
      disclaimerEjs,
    ] = await Promise.all(promises);
    return {
      textAlgorithm: ejs.compile(textAlgorithmEjs, ejsOptions),
      scoredAlgorithm: ejs.compile(scoredAlgorithmEjs, ejsOptions),
      article: ejs.compile(articleEjs, ejsOptions),
      disclaimer: ejs.compile(disclaimerEjs, ejsOptions),
      partials: {
        head: ejs.compile(headEjs, ejsOptions),
        script: ejs.compile(scriptEjs, ejsOptions),
        style: ejs.compile(styleEjs, ejsOptions),
        noOutcomesYet: ejs.compile(noOutcomesYetEjs, ejsOptions),
        outcomeList: ejs.compile(outcomeListEjs, ejsOptions),
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

    const includePartial = (name: string, d?: Record<string, unknown>) => {
      if (!(name in partials))
        throw new Error(`Unknown partial included: ${name}`);
      return partials[name](d, undefined, includePartial);
    };

    return visitor.render({ algorithm }, undefined, includePartial);
  }

  async renderArticle(article: Article): Promise<string> {
    const { article: template } = await this.templates;
    return template({
      title: article.getTitle(),
      body: article.getHtml(),
      lastUpdated: article.getLastUpdated(),
      citations: article.getCitations(),
    });
  }

  async renderDisclaimer(article: Article): Promise<string> {
    const { disclaimer: template } = await this.templates;
    return template({
      title: article.getTitle(),
      body: article.getHtml(),
    });
  }
}

export { EjsRenderer };
