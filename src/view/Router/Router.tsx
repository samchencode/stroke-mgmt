import React from 'react';
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import type { Type as StrokeFactsScreen } from '@/view/StrokeFactsScreen';
import type { Type as StrokeSignsScreen } from '@/view/StrokeSignsScreen';
import type { Type as IntroSequenceScreen } from '@/view/IntroSequenceScreen';
import type { Type as HomeScreen } from '@/view/HomeScreen';
import type { Type as DisclaimerModal } from '@/view/DisclaimerModal';
import type { Type as ArticleViewerScreen } from '@/view/ArticleViewerScreen';
import type { Type as AlgorithmViewerScreen } from '@/view/AlgorithmViewerScreen';
import type { Type as AboutUsScreen } from '@/view/AboutUsScreen';
import type { ArticleId } from '@/domain/models/Article';
import type { AlgorithmId } from '@/domain/models/Algorithm';
import { useShouldShowStrokeFactsAndSigns } from '@/view/lib/shouldShowStrokeFactsAndSigns';
import { LoadingSpinnerView } from '@/view/components';
import type { Type as Header } from '@/view/Router/Header';
import { NoHeader } from '@/view/Router/NoHeader';
import { LicenseScreen } from '@/view/LicenseScreen';

type AppNavigationParams = {
  StrokeFactsScreen: undefined;
  StrokeSignsScreen: undefined;
  IntroSequenceScreen: undefined;
  HomeScreen: undefined;
  ArticleViewerScreen: { id: ArticleId };
  AlgorithmViewerScreen: { id: AlgorithmId };
  AboutUsScreen: undefined;
  LicenseScreen: undefined;
};

type RootNavigationParams = {
  App: NavigatorScreenParams<AppNavigationParams>;
  DisclaimerModal: undefined;
};

const AppStack = createStackNavigator<AppNavigationParams>();
const RootStack = createStackNavigator<RootNavigationParams>();

function factory(
  StrokeFactsScreen: StrokeFactsScreen,
  StrokeSignsScreen: StrokeSignsScreen,
  IntroSequenceScreen: IntroSequenceScreen,
  HomeScreen: HomeScreen,
  DisclaimerModal: DisclaimerModal,
  ArticleViewerScreen: ArticleViewerScreen,
  AlgorithmViewerScreen: AlgorithmViewerScreen,
  AboutUsScreen: AboutUsScreen,
  Header: Header
) {
  function AppNavigation() {
    const shouldShowFactsAndSignsOrLoading = useShouldShowStrokeFactsAndSigns();

    if (shouldShowFactsAndSignsOrLoading === 'loading')
      return <LoadingSpinnerView />;

    return (
      <AppStack.Navigator
        screenOptions={{
          header: Header,
        }}
        initialRouteName={
          shouldShowFactsAndSignsOrLoading === 'yes'
            ? 'IntroSequenceScreen'
            : 'HomeScreen'
        }
      >
        <AppStack.Screen
          name="StrokeFactsScreen"
          component={StrokeFactsScreen}
          options={{ header: NoHeader }}
        />
        <AppStack.Screen
          name="StrokeSignsScreen"
          component={StrokeSignsScreen}
          options={{ header: NoHeader }}
        />
        <AppStack.Screen
          name="IntroSequenceScreen"
          component={IntroSequenceScreen}
          options={{ header: NoHeader }}
        />
        <AppStack.Screen
          name="AboutUsScreen"
          component={AboutUsScreen}
          options={{ title: '' }}
        />
        <AppStack.Screen
          name="LicenseScreen"
          component={LicenseScreen}
          options={{ title: '' }}
        />
        <AppStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: '' }}
        />
        <AppStack.Screen
          name="ArticleViewerScreen"
          component={ArticleViewerScreen}
          options={{ title: '' }}
        />
        <AppStack.Screen
          name="AlgorithmViewerScreen"
          component={AlgorithmViewerScreen}
          options={{ title: '' }}
        />
      </AppStack.Navigator>
    );
  }

  return function RootNavigation() {
    return (
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="App" component={AppNavigation} />
        <RootStack.Screen
          name="DisclaimerModal"
          component={DisclaimerModal}
          options={{ presentation: 'transparentModal' }}
        />
      </RootStack.Navigator>
    );
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
export type AppNavigationProps<T extends keyof AppNavigationParams> =
  CompositeScreenProps<
    StackScreenProps<AppNavigationParams, T>,
    StackScreenProps<RootNavigationParams>
  >;
export type RootNavigationProps<T extends keyof RootNavigationParams> =
  CompositeScreenProps<
    StackScreenProps<RootNavigationParams, T>,
    StackScreenProps<AppNavigationParams>
  >;
