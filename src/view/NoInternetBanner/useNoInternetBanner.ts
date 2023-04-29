import { useState, useCallback, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

function useNoInternetBanner() {
  const [isOffline, setIsOffline] = useState(true);
  const [noInternetBannerDismissed, setNoInternetBannerDismissed] =
    useState(false);
  const shouldShowNoInternetBanner = isOffline && !noInternetBannerDismissed;
  const handleDismissNoInternetBanner = useCallback(() => {
    setNoInternetBannerDismissed(true);
  }, []);

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      if (!state.isConnected !== isOffline) {
        // if disconnected a second time, reset dismissed banner state
        setNoInternetBannerDismissed(false);
      }
    });
  });

  return {
    shouldShowNoInternetBanner,
    handleDismissNoInternetBanner,
  };
}

export { useNoInternetBanner };
