import Constants from 'expo-constants';
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
import { factory as App } from '@/view/App/App';
import { factory as StrokeFactsScreen } from '@/view/StrokeFactsScreen';
import { factory as StrokeSignsScreen } from '@/view/StrokeSignsScreen';
import { factory as HomeScreen } from '@/view/HomeScreen';
import { factory as ArticleViewerScreen } from '@/view/ArticleViewerScreen';
import { factory as AlgorithmViewerScreen } from '@/view/AlgorithmViewerScreen';
import { factory as DisclaimerModal } from '@/view/DisclaimerModal';
import { factory as Router } from '@/view/Router';
import { factory as Header } from '@/view/Router/Header';
import { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import { GetAllAlgorithmsShownOnHomeScreenAction } from '@/application/GetAllAlgorithmsShownOnHomeScreenAction';
import { GetAlgorithmByIdAction } from '@/application/GetAlgorithmByIdAction';
import { EjsRenderer } from '@/infrastructure/rendering/ejs/EjsRenderer';
import { RenderAlgorithmByIdAction } from '@/application/RenderAlgorithmByIdAction';
import { StrapiArticleRepository } from '@/infrastructure/persistence/strapi/StrapiArtcleRepository';
import { StrapiAlgorithmRepository } from '@/infrastructure/persistence/strapi/StrapiAlgorithmRepository';
import { StrapiPlaceholderImageRepository } from '@/infrastructure/persistence/strapi/StrapiPlaceholderImageRepository/StrapiPlaceholderImageRepository';
import { GetAllTagsAction } from '@/application/GetAllTagsAction';
import { StrapiTagRepository } from '@/infrastructure/persistence/strapi/StrapiTagRepository';
import { ReactNativeNetInfo } from '@/infrastructure/network-info/react-native-netinfo/ReactNativeNetInfo';
import { ImageCache } from '@/domain/models/Image';
import {
  AlgorithmCache,
  ArticleCache,
  TagCache,
} from '@/domain/services/Cache';
import { WebsqlCachedArticleRepository } from '@/infrastructure/persistence/websql/WebsqlCachedArticleRepository';
import { cheerioGetImageSrcsInHtml } from '@/infrastructure/html-processing/cheerio/cheerioGetImageSrcsInHtml';
import { cheerioReplaceImageSrcsInHtml } from '@/infrastructure/html-processing/cheerio/cheerioReplaceImageSrcsInHtml';
import { ExpoFileSystemImageStore } from '@/infrastructure/file-system/expo-file-system/ExpoFileSystemImageStore';
import { WebsqlCachedImageMetadataRepository } from '@/infrastructure/persistence/websql/WebsqlCachedImageMetadataRepository';
import { openExpoSqliteDatabase } from '@/infrastructure/persistence/websql/expo-sqlite';
import { WebsqlCachedTagRepository } from '@/infrastructure/persistence/websql/WebsqlCachedTagRepository';
import { ClearCacheAction } from '@/application/ClearCacheAction';
import { WebsqlCachedAlgorithmRepostiory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/WebsqlCachedAlgorithmRepository';

const production = Constants.expoConfig?.extra?.NODE_ENV !== 'development';

export const module = {
  // CONFIG
  strapiHostUrl: [
    'value',
    production
      ? 'https://stroke-mgmt-cms.a2hosted.com'
      : 'http://localhost:1337',
  ],

  // DOMAIN
  imageCache: ['type', ImageCache],
  articleCache: ['type', ArticleCache],
  tagCache: ['type', TagCache],
  algorithmCache: ['type', AlgorithmCache],

  // APPLICATION
  getAllArticlesAction: ['type', GetAllArticlesAction],
  getArticleByIdAction: ['type', GetArticleByIdAction],
  getDisclaimerAction: ['type', GetDisclaimerAction],
  getStrokeFactsAction: ['type', GetStrokeFactsAction],
  getStrokeSignsAction: ['type', GetStrokeSignsAction],
  getAllAlgorithmsShownOnHomeScreenAction: [
    'type',
    GetAllAlgorithmsShownOnHomeScreenAction,
  ],
  getAlgorithmByIdAction: ['type', GetAlgorithmByIdAction],
  getAllTagsAction: ['type', GetAllTagsAction],
  renderArticleByIdAction: ['type', RenderArticleByIdAction],
  renderAlgorithmByIdAction: ['type', RenderAlgorithmByIdAction],
  renderAlgorithmAction: ['type', RenderAlgorithmAction],
  renderDisclaimerAction: ['type', RenderDisclaimerAction],
  renderStrokeFactsAction: ['type', RenderStrokeFactsAction],
  renderStrokeSignsAction: ['type', RenderStrokeSignsAction],
  clearCacheAction: ['type', ClearCacheAction],

  // INFRASTRUCTURE
  articleRepository: ['type', StrapiArticleRepository],
  algorithmRepository: ['type', StrapiAlgorithmRepository],
  placeholderImageRepository: ['type', StrapiPlaceholderImageRepository],
  tagRepository: ['type', StrapiTagRepository],
  fileSystem: ['type', ExpoAssetFileSystem],
  networkInfo: ['type', ReactNativeNetInfo],
  articleRenderer: [
    'factory',
    // use same EjsRenderer instance as algorithmRenderer does
    (algorithmRenderer: unknown) => algorithmRenderer,
  ],
  algorithmRenderer: ['type', EjsRenderer],
  cachedArticleRepository: ['type', WebsqlCachedArticleRepository],
  getImageSrcsInHtml: ['value', cheerioGetImageSrcsInHtml],
  replaceImageSrcsInHtml: ['value', cheerioReplaceImageSrcsInHtml],
  imageStore: ['type', ExpoFileSystemImageStore],
  cachedImageMetadataRepository: ['type', WebsqlCachedImageMetadataRepository],
  websqlDatabase: ['factory', openExpoSqliteDatabase],
  cachedTagRepository: ['type', WebsqlCachedTagRepository],
  cachedAlgorithmRepository: ['type', WebsqlCachedAlgorithmRepostiory],

  // TEMPLATES
  App: ['factory', App],
  Router: ['factory', Router],
  StrokeFactsScreen: ['factory', StrokeFactsScreen],
  StrokeSignsScreen: ['factory', StrokeSignsScreen],
  HomeScreen: ['factory', HomeScreen],
  DisclaimerModal: ['factory', DisclaimerModal],
  ArticleViewerScreen: ['factory', ArticleViewerScreen],
  AlgorithmViewerScreen: ['factory', AlgorithmViewerScreen],
  Header: ['factory', Header],

  // BUILT-INS
  fetch: ['value', fetch],
};
