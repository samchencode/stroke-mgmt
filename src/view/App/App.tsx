import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '@/view/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, useInitReactQuery } from '@/view/App/prepareReactQuery';
import { SnackbarProvider } from '@/view/Snackbar';
import {
  HeaderScrollContext,
  useHeaderScrollData,
} from '@/view/Router/HeaderScrollContext';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/view/error-handling';

type AppProps = {
  onLayout?: (e: LayoutChangeEvent) => void;
};

function factory(Router: Router) {
  return function App({ onLayout = undefined }: AppProps) {
    useInitReactQuery();

    const headerScrollState = useHeaderScrollData();

    return (
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ErrorBoundary>
            <NavigationContainer
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              theme={{ colors: { background: theme.colors.background } } as any}
            >
              <QueryClientProvider client={queryClient}>
                <HeaderScrollContext.Provider value={headerScrollState}>
                  <SnackbarProvider>
                    <Router />
                  </SnackbarProvider>
                </HeaderScrollContext.Provider>
              </QueryClientProvider>
            </NavigationContainer>
          </ErrorBoundary>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  };
}

factory.$inject = ['Router'];

type Type = ReturnType<typeof factory>;

export { factory };
export type { Type };
