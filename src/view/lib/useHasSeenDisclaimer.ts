import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEEN = 'true';
const STORAGE_KEY = '@hasSeenDisclaimer-v1';

async function setSeenDisclaimer() {
  AsyncStorage.setItem(STORAGE_KEY, SEEN);
}

async function hasSeenDisclaimer() {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === SEEN;
}

const seenOrNot = hasSeenDisclaimer();

function useHasSeenDisclaimer(notSeenCallback: () => void) {
  useEffect(() => {
    seenOrNot.then((seen) => {
      if (seen) return;
      notSeenCallback();
    });
  }, [notSeenCallback]);
}

export { setSeenDisclaimer, useHasSeenDisclaimer };
