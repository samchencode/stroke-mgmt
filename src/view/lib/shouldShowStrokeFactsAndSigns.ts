import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@shouldShowStrokeFactsAndSigns';

const HIDE = 'hide';

const SHOW = 'show';

type ShouldShow = 'loading' | 'yes' | 'no';

export async function hideStrokeFactsAndSigns() {
  return AsyncStorage.setItem(STORAGE_KEY, HIDE);
}

export async function showStrokeFactsAndSigns() {
  return AsyncStorage.setItem(STORAGE_KEY, SHOW);
}

export async function checkShouldShow() {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value !== HIDE;
}

export function useShouldShowStrokeFactsAndSigns(): ShouldShow {
  const [shouldShow, setShouldShow] = useState<ShouldShow>('loading');
  useEffect(() => {
    checkShouldShow()
      .then((v) => (v ? 'yes' : 'no'))
      .then(setShouldShow);
  }, []);
  return shouldShow;
}
