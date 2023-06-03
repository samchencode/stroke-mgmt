import { IconButton } from '@/view/components';
import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  pageIdx: number;
  totalPages: number;
  onPressLeft: () => void;
  onPressRight: () => void;
};

function CarouselPaginationControls({
  pageIdx,
  onPressLeft,
  onPressRight,
  totalPages,
}: Props) {
  const canGoLeft = totalPages !== 0 && pageIdx !== 0;
  const canGoRight = totalPages !== 0 && pageIdx !== totalPages - 1;
  const pageNum = pageIdx + 1;

  return (
    <View style={styles.container}>
      <IconButton
        iconName="angle-left"
        onPress={onPressLeft}
        disabled={!canGoLeft}
      />
      <Text style={styles.pageNumberText}>Page {pageNum}</Text>
      <IconButton
        iconName="angle-right"
        onPress={onPressRight}
        disabled={!canGoRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberText: theme.fonts.labelLarge,
});

export { CarouselPaginationControls };
