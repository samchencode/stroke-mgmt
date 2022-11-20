import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { GetDisclaimerAction } from '@/application/GetDisclaimerAction';
import { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';
import { GetStrokeSignsAction } from '@/application/GetStrokeSignsAction';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { factory as App } from '@/view/App';

export const module = {
  // APPLICATION
  getAllArticlesAction: ['type', GetAllArticlesAction],
  getDisclaimerAction: ['type', GetDisclaimerAction],
  getStrokeFactsAction: ['type', GetStrokeFactsAction],
  getStrokeSignsAction: ['type', GetStrokeSignsAction],

  // INFRASTRUCTURE
  articleRepository: ['type', FakeArticleRepository],

  // TEMPLATES
  App: ['factory', App],
};
