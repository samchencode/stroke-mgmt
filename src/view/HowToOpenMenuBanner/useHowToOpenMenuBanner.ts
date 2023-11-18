import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@hasSeenHowToOpenMenuBanner-v1';

async function checkHasSeenBanner(): Promise<boolean> {
  const value = (await AsyncStorage.getItem(STORAGE_KEY)) !== null;
  return value;
}

async function setHasSeenBanner(): Promise<void> {
  return AsyncStorage.setItem(STORAGE_KEY, 'true');
}

function useHowToOpenMenuBanner() {
  const [shouldShowHowToOpenMenuBanner, setVisible] = useState(false);
  useEffect(() => {
    checkHasSeenBanner().then((hasSeen) => {
      if (!hasSeen) setVisible(true);
    });
  }, []);

  const handleDismissHowToOpenMenuBanner = useCallback(() => {
    setVisible(false);
    setHasSeenBanner();
  }, []);

  return { shouldShowHowToOpenMenuBanner, handleDismissHowToOpenMenuBanner };
}

export { useHowToOpenMenuBanner };
