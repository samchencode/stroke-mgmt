import { theme } from '@/view/theme';
import React, { useCallback } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import type { Tag } from '@/domain/models/Tag';

type Props = {
  tag: Tag;
  onPress: (v: Tag) => void;
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

function TagItem({ tag, onPress, active, style = {} }: Props) {
  const handlePress = useCallback(() => onPress(tag), [onPress, tag]);

  return (
    <TouchableHighlight
      onPress={handlePress}
      underlayColor={theme.colors.opacity(0.12).onSurface}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.contentContainer,
          active
            ? styles.activeContentContainer
            : styles.inactiveContentContainer,
        ]}
      >
        {active && <FontAwesome5 name="check" size={18} style={styles.icon} />}
        <Text
          style={[
            styles.text,
            active ? styles.activeText : styles.inactiveText,
          ]}
          numberOfLines={1}
        >
          {tag.getName()}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  contentContainer: {
    paddingRight: 16,
    paddingLeft: 8,
    borderRadius: 8,
    height: 32,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inactiveContentContainer: {
    borderColor: theme.colors.outline,
    borderWidth: 1,
  },
  activeContentContainer: {
    backgroundColor: theme.colors.secondaryContainer,
    // to prevent layout shift
    borderColor: theme.colors.secondaryContainer,
    borderWidth: 1,
  },
  text: {
    ...theme.fonts.labelLarge,
    maxWidth: 300,
    marginLeft: 8, // 8 + 8 from container = 16
  },
  activeText: {
    color: theme.colors.onSecondaryContainer,
  },
  inactiveText: {
    color: theme.colors.onSurfaceVariant,
  },
  icon: {
    color: theme.colors.onSecondaryContainer,
  },
});

export { TagItem };
