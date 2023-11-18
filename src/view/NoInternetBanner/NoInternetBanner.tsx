import React from 'react';
import { Banner } from '@/view/components';

type Props = {
  visible: boolean;
  onPressDismiss: () => void;
};

function NoInternetBanner({ visible, onPressDismiss }: Props) {
  return (
    <Banner
      content="There is no internet connection, thus we could not download the latest data."
      dismissText="Dismiss"
      iconName="wifi"
      visible={visible}
      onPressDismiss={onPressDismiss}
    />
  );
}

export { NoInternetBanner };
