import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import { GetDisclaimerAction } from '@/application/GetDisclaimerAction';
import { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';
import { GetStrokeSignsAction } from '@/application/GetStrokeSignsAction';
import { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';
import { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';
import { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import { ExpoAssetFileSystem } from '@/infrastructure/file-system/expo-asset/ExpoAssetFileSystem';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { FakeAlgorithmRepository } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer';
import { factory as App } from '@/view/App';
import { factory as StrokeFactsScreen } from '@/view/StrokeFactsScreen';
import { factory as StrokeSignsScreen } from '@/view/StrokeSignsScreen';
import { factory as HomeScreen } from '@/view/HomeScreen';
import { factory as ArticleViewerScreen } from '@/view/ArticleViewerScreen';
import { factory as AlgorithmViewerScreen } from '@/view/AlgorithmViewerScreen';
import { factory as DisclaimerModal } from '@/view/DisclaimerModal';
import { factory as Router } from '@/view/Router';
import { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import { GetAllAlgorithmsAction } from '@/application/GetAllAlgorithmsAction';
import { GetAlgorithmByIdAction } from '@/application/GetAlgorithmByIdAction';
import { EjsAlgorithmRenderer } from '@/infrastructure/rendering/ejs/EjsAlgorithmRenderer';

export const module = {
  // APPLICATION
  getAllArticlesAction: ['type', GetAllArticlesAction],
  getArticleByIdAction: ['type', GetArticleByIdAction],
  getDisclaimerAction: ['type', GetDisclaimerAction],
  getStrokeFactsAction: ['type', GetStrokeFactsAction],
  getStrokeSignsAction: ['type', GetStrokeSignsAction],
  getAllAlgorithmsAction: ['type', GetAllAlgorithmsAction],
  getAlgorithmByIdAction: ['type', GetAlgorithmByIdAction],
  renderArticleByIdAction: ['type', RenderArticleByIdAction],
  renderAlgorithmAction: ['type', RenderAlgorithmAction],
  renderDisclaimerAction: ['type', RenderDisclaimerAction],
  renderStrokeFactsAction: ['type', RenderStrokeFactsAction],
  renderStrokeSignsAction: ['type', RenderStrokeSignsAction],

  // INFRASTRUCTURE
  articleRepository: ['type', FakeArticleRepository],
  algorithmRepository: ['type', FakeAlgorithmRepository],
  fileSystem: ['type', ExpoAssetFileSystem],
  articleRenderer: ['type', EjsArticleRenderer],
  algorithmRenderer: ['type', EjsAlgorithmRenderer],

  // TEMPLATES
  App: ['factory', App],
  Router: ['factory', Router],
  StrokeFactsScreen: ['factory', StrokeFactsScreen],
  StrokeSignsScreen: ['factory', StrokeSignsScreen],
  HomeScreen: ['factory', HomeScreen],
  DisclaimerModal: ['factory', DisclaimerModal],
  ArticleViewerScreen: ['factory', ArticleViewerScreen],
  AlgorithmViewerScreen: ['factory', AlgorithmViewerScreen],
};
