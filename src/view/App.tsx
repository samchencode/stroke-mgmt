import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';

function factory(Router: Router) {
  return function App() {
    return (
      <NavigationContainer>
        <Router />
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  };
}

type Type = ReturnType<typeof factory>;

export { factory };
export type { Type };
