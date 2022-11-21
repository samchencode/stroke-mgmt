import React from 'react';
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Type as StrokeFactsScreen } from '@/view/StrokeFactsScreen';
import type { Type as StrokeSignsScreen } from '@/view/StrokeSignsScreen';
import type { Type as DisclaimerModal } from '@/view/DisclaimerModal';

type AppNavigationParams = {
  StrokeFactsScreen: undefined;
  StrokeSignsScreen: undefined;
  HomeScreen: undefined;
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
  DisclaimerModal: DisclaimerModal
) {
  function AppNavigation() {
    return (
      <AppStack.Navigator>
        <AppStack.Screen
          name="StrokeFactsScreen"
          component={StrokeFactsScreen}
        />
        <AppStack.Screen
          name="StrokeSignsScreen"
          component={StrokeSignsScreen}
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
        <RootStack.Screen name="DisclaimerModal" component={DisclaimerModal} />
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