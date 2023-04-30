import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export function useSetAndroidBottomNavigationBarColor(
  color: string,
  style: 'light' | 'dark'
) {
  useEffect(() => {
    if (Platform.OS === 'ios') return;
    NavigationBar.setBackgroundColorAsync(color);
    NavigationBar.setButtonStyleAsync(style);
  }, [color, style]);
}
