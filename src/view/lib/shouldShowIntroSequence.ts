import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@shouldShowIntroSequence-v1';

const HIDE = 'hide';

const SHOW = 'show';

type ShouldShow = 'loading' | 'yes' | 'no';

export async function hideIntroSequence() {
  return AsyncStorage.setItem(STORAGE_KEY, HIDE);
}

export async function showIntroSequence() {
  return AsyncStorage.setItem(STORAGE_KEY, SHOW);
}

export async function checkShouldShow() {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value !== HIDE;
}

export function useShouldShowIntroSequence(): ShouldShow {
  const [shouldShow, setShouldShow] = useState<ShouldShow>('loading');
  useEffect(() => {
    checkShouldShow()
      .then((v) => (v ? 'yes' : 'no'))
      .then(setShouldShow);
  }, []);
  return shouldShow;
}

export function reconcileDontShowValue(
  dontShowCheckboxValue: boolean,
  dontShowStoredValue: boolean
) {
  if (dontShowCheckboxValue && !dontShowStoredValue) {
    hideIntroSequence();
  }
  if (!dontShowCheckboxValue && dontShowStoredValue) {
    showIntroSequence();
  }
}
