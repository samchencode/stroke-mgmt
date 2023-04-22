import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import { theme } from '@/view/theme';
import type { ArticleId } from '@/domain/models/Article';

type ArticleRowProps = {
  id: ArticleId;
  title: string;
  subtitle: string;
  imageUri: string;
  onSelectArticle: (id: ArticleId) => void;
};

function ArticleRow({
  id,
  title,
  imageUri,
  subtitle,
  onSelectArticle,
}: ArticleRowProps) {
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
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    height: 64 + 12 * 2,
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    marginRight: theme.spaces.md,
    height: 64,
    width: 96,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    ...theme.fonts.bodyLarge,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    ...theme.fonts.bodyMedium,
  },
});

export { ArticleRow };
