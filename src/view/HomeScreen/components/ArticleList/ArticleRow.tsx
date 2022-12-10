import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '@/view/theme';
import type { ArticleId } from '@/domain/models/Article';

type ArticleRowProps = {
  id: ArticleId;
  title: string;
  onSelectArticle: (id: ArticleId) => void;
};

function ArticleRow({ id, title, onSelectArticle }: ArticleRowProps) {
  const handleSelectArticle = useCallback(
    () => onSelectArticle(id),
    [id, onSelectArticle]
  );

  return (
    <TouchableHighlight
      underlayColor={theme.colors.surfaceVariant}
      onPress={handleSelectArticle}
    >
      <View style={styles.container}>
        <Ionicons
          name="document-outline"
          size={24}
          color={theme.colors.onBackground}
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spaces.sm,
    paddingBottom: theme.spaces.sm,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: theme.spaces.md,
    marginRight: theme.spaces.md,
  },
  title: { ...theme.fonts.bodyLarge },
});

export { ArticleRow };
