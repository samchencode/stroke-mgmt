import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/view/theme';

type Props = {
  content: React.ReactNode;
  iconName: string;
  visible: boolean;
  onPressDismiss: () => void;
  dismissText?: string;
};

function Banner({
  content: text,
  iconName,
  visible,
  onPressDismiss,
  dismissText = 'Dismiss',
}: Props) {
  return (
    <View style={[styles.container, visible && { display: 'flex' }]}>
      <View style={styles.messageBox}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name={iconName} size={24} style={styles.icon} />
        </View>
        <Text style={styles.messageText}>{text}</Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={onPressDismiss}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{dismissText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: theme.spaces.md,
    paddingRight: theme.spaces.sm,
    paddingTop: theme.spaces.lg,
    paddingBottom: theme.spaces.sm,
    backgroundColor: theme.colors.surfaceContainerLow,
    ...theme.elevations[1],
    display: 'none',
  },
  messageBox: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: theme.spaces.sm,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spaces.md,
  },
  icon: {
    color: theme.colors.onPrimary,
  },
  messageText: {
    flex: 1,
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spaces.sm,
  },
  buttonText: {
    color: theme.colors.primary,
    ...theme.fonts.labelLarge,
  },
});

export { Banner };
