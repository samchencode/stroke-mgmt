import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import type { Injector } from 'didi';
import type { UpdateService } from '@/application/UpdateService';
import type { Type as App } from '@/view/App/App';

SplashScreen.preventAutoHideAsync();

function factory(updateService: UpdateService, injector: Injector) {
  const updatePromise = updateService.performPostUpdateChangesIfNecessary();

  return function Root() {
    const [App, setApp] = useState<null | App>(null);
    useEffect(() => {
      updatePromise.then(() => {
        const AppComponent = injector.get<App>('App');
        setApp(() => AppComponent);
      });
    }, []);

    const hideSplashScreenOnLayout = useCallback(async () => {
      if (App) await SplashScreen.hideAsync();
    }, [App]);

    return App ? <App onLayout={hideSplashScreenOnLayout} /> : null;
  };
}

factory.$inject = ['updateService', 'injector'];

export { factory };
export type Type = ReturnType<typeof factory>;
