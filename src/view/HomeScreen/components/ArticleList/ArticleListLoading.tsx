import { LoadingSpinnerView } from '@/view/components';
import React from 'react';
import { View } from 'react-native';

type Props = {
  height: number;
};

function ArticleListLoading({ height }: Props) {
  return (
    <View style={{ height }}>
      <LoadingSpinnerView />
    </View>
  );
}

export { ArticleListLoading };
