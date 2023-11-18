import React from 'react';
import { Text } from 'react-native';
import { Banner } from '@/view/components';
import { FontAwesome5 } from '@expo/vector-icons';

type HowToOpenMenuBannerParams = {
  visible: boolean;
  onPressDismiss: () => void;
};

function HowToOpenMenuBanner({
  visible,
  onPressDismiss,
}: HowToOpenMenuBannerParams) {
  return (
    <Banner
      content={
        <Text>
          Press the [ <FontAwesome5 name="ellipsis-v" /> ] on the top right of
          the screen for menu options such as returning to the introductory
          slideshow.
        </Text>
      }
      iconName="info"
      dismissText="Got it!"
      visible={visible}
      onPressDismiss={onPressDismiss}
    />
  );
}

export { HowToOpenMenuBanner };
