import { useEffect } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  onlineManager,
  focusManager,
  QueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

// Notify react-query on net state changes.
// Enables refetch on network status change.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  })
);

// Notify react-query on App focus
// Enables refetch on App focus
function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

function useReactQueryAppStateListener() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}

export { useReactQueryAppStateListener, queryClient };
