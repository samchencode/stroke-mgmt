import React from 'react';
import { View } from 'react-native';
import type { StatusBarAnimation, StatusBarStyle } from 'expo-status-bar';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

type StatusBarProps = {
  animated?: boolean;
  textColor?: StatusBarStyle;
  hidden?: boolean;
  backgroundColor?: string;
  translucent?: boolean;
  hideTransitionAnimation?: StatusBarAnimation;
  networkActivityIndicatorVisible?: boolean;
};

function StatusBar({
  animated = undefined,
  textColor = undefined,
  hidden = undefined,
  backgroundColor = undefined,
  translucent = undefined,
  hideTransitionAnimation = undefined,
  networkActivityIndicatorVisible = undefined,
}: StatusBarProps) {
  return (
    <View
      style={{
        height: translucent ? 0 : Constants.statusBarHeight,
        width: '100%',
        backgroundColor: backgroundColor ?? 'transparent',
      }}
    >
      <ExpoStatusBar
        animated={animated}
        style={textColor}
        hidden={hidden}
        backgroundColor={backgroundColor}
        translucent={translucent}
        hideTransitionAnimation={hideTransitionAnimation}
        networkActivityIndicatorVisible={networkActivityIndicatorVisible}
      />
    </View>
  );
}

export { StatusBar };
