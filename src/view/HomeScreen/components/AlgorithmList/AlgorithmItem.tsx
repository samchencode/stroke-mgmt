import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { theme } from '@/view/theme';
import { TouchableHighlight } from 'react-native-gesture-handler';

type AlgorithmItemProps = {
  id: string;
  name: string;
  body: string;
  imageUri: string;
  onPress: (id: string) => void;
  style?: StyleProp<ViewStyle>;
};

function AlgorithmItem({
  id,
  name,
  body,
  imageUri,
  onPress,
  style = {},
}: AlgorithmItemProps) {
  return (
    <TouchableHighlight
      onPress={useCallback(() => onPress(id), [onPress, id])}
      underlayColor={theme.colors.background}
    >
      <View style={[styles.container, style]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    ...theme.elevations[2],
  },
  contentContainer: {
    padding: theme.spaces.sm,
  },
  image: {
    height: 150,
    backgroundColor: 'navy',
    borderRadius: 12,
  },
  title: theme.fonts.titleMedium,
  body: {
    marginTop: theme.spaces.sm,
    ...theme.fonts.bodyMedium,
  },
});

export { AlgorithmItem };
