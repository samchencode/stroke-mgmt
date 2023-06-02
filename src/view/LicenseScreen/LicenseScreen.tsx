import { licenseText } from '@/view/LicenseScreen/licenseText';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';
import React, { useCallback } from 'react';
import type {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type LicenseSection = {
  key: string;
  text: string;
};

const licenseSections = licenseText
  .split(/^-----$/gm)
  .map<LicenseSection>((t, i) => ({
    key: i.toString(),
    text: `${t}-----`,
  }));

function renderItem({ item }: ListRenderItemInfo<LicenseSection>) {
  return <Text>{item.text}</Text>;
}

function getKey(ls: LicenseSection) {
  return ls.key;
}

function LicenseScreen() {
  type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
  const handleScroll = useHeaderScrollResponder<ScrollEvent>(
    useCallback((e: ScrollEvent) => e.nativeEvent.contentOffset.y, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={licenseSections}
        renderItem={renderItem}
        keyExtractor={getKey}
        onScroll={handleScroll}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },
});

export { LicenseScreen };
