import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '@/view/theme';

function factory(Router: Router) {
  return function App() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
          theme={{ colors: { background: theme.colors.background } } as any}
        >
          <Router />
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  };
}

type Type = ReturnType<typeof factory>;

export { factory };
export type { Type };
