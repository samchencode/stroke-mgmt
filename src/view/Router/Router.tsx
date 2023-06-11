import React from 'react';
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import type { Type as IntroSequenceScreen } from '@/view/IntroSequenceScreen';
import type { Type as HomeScreen } from '@/view/HomeScreen';
import type { Type as DisclaimerModal } from '@/view/DisclaimerModal';
import type { Type as ArticleViewerScreen } from '@/view/ArticleViewerScreen';
import type { Type as AlgorithmViewerScreen } from '@/view/AlgorithmViewerScreen';
import type { Type as AboutUsScreen } from '@/view/AboutUsScreen';
import type { ArticleId } from '@/domain/models/Article';
import type { AlgorithmId } from '@/domain/models/Algorithm';
import { useShouldShowIntroSequence } from '@/view/lib/shouldShowIntroSequence';
import { LoadingSpinnerView } from '@/view/components';
import type { Type as Header } from '@/view/Router/Header';
import { NoHeader } from '@/view/Router/NoHeader';
import { LicenseScreen } from '@/view/LicenseScreen';
import { EvaluatingPatientModal } from '@/view/EvaluatingPatientModal/EvaluatingPatientModal';

type AppNavigationParams = {
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
  EvaluatingPatientModal: { suggestedAlgorithmId: AlgorithmId };
};

const AppStack = createStackNavigator<AppNavigationParams>();
const RootStack = createStackNavigator<RootNavigationParams>();

function factory(
  IntroSequenceScreen: IntroSequenceScreen,
  HomeScreen: HomeScreen,
  DisclaimerModal: DisclaimerModal,
  ArticleViewerScreen: ArticleViewerScreen,
  AlgorithmViewerScreen: AlgorithmViewerScreen,
  AboutUsScreen: AboutUsScreen,
  Header: Header
) {
  function AppNavigation() {
    const shouldShowFactsAndSignsOrLoading = useShouldShowIntroSequence();

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
        <RootStack.Screen
          name="EvaluatingPatientModal"
          component={EvaluatingPatientModal}
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
