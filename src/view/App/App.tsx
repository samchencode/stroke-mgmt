import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '@/view/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  queryClient,
  useReactQueryAppStateListener,
} from '@/view/App/prepareReactQuery';
import { SnackbarProvider } from '@/view/Snackbar';
import {
  HeaderScrollContext,
  useHeaderScrollData,
} from '@/view/Router/HeaderScrollContext';

function factory(Router: Router) {
  return function App() {
    useReactQueryAppStateListener();

    const headerScrollState = useHeaderScrollData();

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
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
      </GestureHandlerRootView>
    );
  };
}

type Type = ReturnType<typeof factory>;

export { factory };
export type { Type };
