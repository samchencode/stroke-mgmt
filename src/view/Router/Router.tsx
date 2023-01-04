import React from 'react';
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Type as StrokeFactsScreen } from '@/view/StrokeFactsScreen';
import type { Type as StrokeSignsScreen } from '@/view/StrokeSignsScreen';
import type { Type as HomeScreen } from '@/view/HomeScreen';
import type { Type as DisclaimerModal } from '@/view/DisclaimerModal';
import type { Type as ArticleViewerScreen } from '@/view/ArticleViewerScreen';
import type { Type as AlgorithmViewerScreen } from '@/view/AlgorithmViewerScreen';
import type { ArticleId } from '@/domain/models/Article';
import type { AlgorithmId } from '@/domain/models/Algorithm';
import { theme } from '@/view/theme';

type AppNavigationParams = {
  StrokeFactsScreen: undefined;
  StrokeSignsScreen: undefined;
  HomeScreen: undefined;
  ArticleViewerScreen: { id: ArticleId };
  AlgorithmViewerScreen: { id: AlgorithmId };
};

type RootNavigationParams = {
  App: NavigatorScreenParams<AppNavigationParams>;
  DisclaimerModal: undefined;
};

const AppStack = createNativeStackNavigator<AppNavigationParams>();
const RootStack = createNativeStackNavigator<RootNavigationParams>();

function factory(
  StrokeFactsScreen: StrokeFactsScreen,
  StrokeSignsScreen: StrokeSignsScreen,
  HomeScreen: HomeScreen,
  DisclaimerModal: DisclaimerModal,
  ArticleViewerScreen: ArticleViewerScreen,
  AlgorithmViewerScreen: AlgorithmViewerScreen
) {
  function AppNavigation() {
    return (
      <AppStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
        }}
      >
        <AppStack.Screen
          name="StrokeFactsScreen"
          component={StrokeFactsScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="StrokeSignsScreen"
          component={StrokeSignsScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: '' }}
        />
        <AppStack.Screen
          name="ArticleViewerScreen"
          component={ArticleViewerScreen}
        />
        <AppStack.Screen
          name="AlgorithmViewerScreen"
          component={AlgorithmViewerScreen}
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
    NativeStackScreenProps<AppNavigationParams, T>,
    NativeStackScreenProps<RootNavigationParams>
  >;
export type RootNavigationProps<T extends keyof RootNavigationParams> =
  CompositeScreenProps<
    NativeStackScreenProps<RootNavigationParams, T>,
    NativeStackScreenProps<AppNavigationParams>
  >;
