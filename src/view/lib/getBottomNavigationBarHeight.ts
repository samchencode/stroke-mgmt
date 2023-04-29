import Constants from 'expo-constants';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function getAndroidNavigationBarHeight(
  screenHeight: number,
  windowHeight: number,
  statusBarHeight: number
) {
  return screenHeight - windowHeight - statusBarHeight;
}

function useBottomNavigationBarHeight() {
  const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const SCREEN_HEIGHT = Dimensions.get('screen').height;
  const IOS_BOTTOM_INSET = useSafeAreaInsets().bottom;

  return Platform.OS === 'ios'
    ? IOS_BOTTOM_INSET
    : getAndroidNavigationBarHeight(
        SCREEN_HEIGHT,
        WINDOW_HEIGHT,
        STATUS_BAR_HEIGHT
      );
}

export { useBottomNavigationBarHeight };
